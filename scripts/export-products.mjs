/**
 * Exporte la collection Firestore `products` dans un fichier JSON.
 *
 * Utilise le SDK Firebase de l'application (pas de clé de compte de service) :
 * le script se connecte avec un compte administrateur, exactement comme l'app,
 * donc les règles Firestore s'appliquent et seule la lecture est effectuée.
 *
 * Lancement (Node 20.6 ou plus, depuis la racine du projet) :
 *   node --env-file=.env scripts/export-products.mjs
 *
 * Résultat : exports/products.json (dossier ignoré par Git).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, Timestamp } from "firebase/firestore";

const OUTPUT_DIR = "exports";
const OUTPUT_FILE = `${OUTPUT_DIR}/products.json`;

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

/** Les Timestamp Firestore deviennent des dates ISO lisibles dans le JSON. */
function toPlainValue(value) {
  return value instanceof Timestamp ? value.toDate().toISOString() : value;
}

function toPlainObject(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, toPlainValue(value)]));
}

/**
 * Identifiants du compte admin : demandés dans le terminal (rien n'est enregistré),
 * ou lus dans ADMIN_EMAIL / ADMIN_PASSWORD s'ils sont définis.
 */
async function getCredentials() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  // Si la saisie est interrompue (Ctrl+C, entrée fermée), on échoue clairement au lieu de rester bloqué.
  const closed = new Promise((_, reject) => rl.once("close", () => reject(new Error("Saisie interrompue."))));
  try {
    const email = (await Promise.race([rl.question("Email admin : "), closed])).trim();
    const password = await Promise.race([rl.question("Mot de passe : "), closed]);
    return { email, password };
  } finally {
    rl.close();
  }
}

async function main() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      "Configuration Firebase introuvable. Lance le script avec : node --env-file=.env scripts/export-products.mjs",
    );
  }

  const app = initializeApp(firebaseConfig);
  const { email, password } = await getCredentials();
  await signInWithEmailAndPassword(getAuth(app), email, password);

  const snapshot = await getDocs(collection(getFirestore(app), "products"));
  const products = snapshot.docs
    .map((doc) => ({ id: doc.id, ...toPlainObject(doc.data()) }))
    .sort((a, b) => String(a.category).localeCompare(String(b.category)) || String(a.name).localeCompare(String(b.name)));

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`✅ ${products.length} produit(s) exporté(s) dans ${OUTPUT_FILE}`);
}

main()
  .then(() => process.exit(0)) // Firebase garde des connexions ouvertes : on termine explicitement
  .catch((error) => {
    console.error(`❌ Échec de l'export : ${error.code ?? error.message}`);
    process.exit(1);
  });
