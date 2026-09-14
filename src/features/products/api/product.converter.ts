import {
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SetOptions,
  type SnapshotOptions,
  type WithFieldValue,
} from 'firebase/firestore';
import type { Product } from '../types/product.types';

/**
 * Minimal shape of a Firestore Timestamp: an object with a `toDate()`
 * method. Checked structurally instead of via `instanceof Timestamp`.
 */
interface TimestampLike {
  toDate: () => Date;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as TimestampLike).toDate === 'function'
  );
}

/** 
* Convertit de manière sécurisée une valeur Firestore brute en `Date`.
* IMPORTANT : cette fonction vérifie volontairement si l'objet possède une * méthode `toDate()` (approche structurelle, ou « duck typing ») 
* plutôt que  d'utiliser `value instanceof Timestamp` 
* `instanceof` compare un objet à une référence de classe BIEN PRÉCISE. 
*
* Si le projet finit par contenir deux copies différentes du SDK Firebase 
* dans `node_modules` (par exemple à cause d'une dépendance transitive qui 
* embarque sa propre version de `firebase`, d'un conflit de versions ou 
* d'un lien symbolique dans un monorepo), deux classes `Timestamp` distinctes 
* peuvent alors exister en mémoire.
* 
* L'objet renvoyé par Firestore peut avoir été créé par « l'autre » instance de `Timestamp`. 
* Dans ce cas, `instanceof` retourne silencieusement `false`,
* alors que l'objet est bien un Timestamp valide et possède une méthode `.toDate()` fonctionnelle.
* C'est précisément le type de problème qui peut provoquer l'échec de tous les documents de la même manière, 
* y compris ceux dont les données ont été vérifiées comme correctement typées dans la console Firestore.
* Le problème ne vient alors pas des données Firestore, mais de la vérification d'identité effectuée par `instanceof`.
* `console.warn` continue néanmoins d'être déclenché lorsque les données sont réellement absentes 
* ou invalides (par exemple lorsqu'un champ est absent * du document ou contient une chaîne de caractères à la place d'un Timestamp).
* On conserve donc une véritable sécurité tout en évitant les faux positifs 
* liés à la duplication du module Firebase. 
*/
function toDateSafe(value: unknown, fieldName: string, docId: string): Date {
  if (isTimestampLike(value)) {
    return value.toDate();
  }

  console.warn(
    `[productConverter] Document "${docId}" has an invalid or missing "${fieldName}" field — using a fallback date. Check this document in Firestore.`,
  );
  return new Date(0);
}

/**
* Fait le lien entre les données stockées dans Firestore et les objets * utilisés par l'application (le type `Product`). 
* Toutes les lectures et écritures de la collection `products` passent par ce converter. 
* Il est associé à la référence de la collection via * `.withConverter(productConverter)`, ce qui permet au reste du code 
* de l'application de ne jamais manipuler directement les documents * Firestore bruts. 
*/
export const productConverter: FirestoreDataConverter<Product> = {
  /** 
   * Product -> données du document Firestore (écriture).
   *  `id` est retiré avant l'écriture : il provient de `snapshot.id`, c'est-à-dire
   * de l'identifiant propre au document Firestore, et non d'un champ stocké dans le document.
   * L'enregistrer également comme champ du document ferait donc doublon. *
   * toFirestore( // product: WithFieldValue<Product> | PartialWithFieldValue<Product>, // _options?: SetOptions, // ): DocumentData { // const { id, ...data } = product as WithFieldValue<Product>; 
   *  // return data; //},
  */
  toFirestore(
    product: WithFieldValue<Product> | PartialWithFieldValue<Product>,
    _options?: SetOptions,
  ): DocumentData {
    const { id, ...data } = product as WithFieldValue<Product>;
    // Firestore refuse les valeurs `undefined` pour les champs : une propriété 
    // doit contenir une vraie valeur, `null`, ou être complètement absente. 
    //
    // // Les champs optionnels de `Product` (`imageUrl` aujourd'hui, et potentiellement 
    // d'autres à l'avenir) peuvent légitimement être `undefined` en mémoire lorsque
    // le formulaire est laissé vide.
    // 
    // Supprimer ces propriétés ici, de manière centralisée, permet de protéger
    // toutes les écritures effectuées via ce converter : aussi bien la création
    // actuelle que les futurs formulaires de modification.
    // 
    // Les différents appelants n'ont donc pas besoin de penser eux-mêmes à 
    // supprimer les champs optionnels vides.
    return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
  },

  /** 
  * Document Firestore -> Product (lecture).
  * 
  * L'objet est reconstruit champ par champ plutôt que via un spread suivi
  * d'un cast de type. Ainsi, un champ renommé ou manquant peut être détecté
  * par TypeScript directement ici. 
  * 
  * `createdAt` et `lastUpdated` passent également par `toDateSafe` plutôt 
  * que de faire une simple assertion de type. 
  * */
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Product {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      imageUrl: data.imageUrl,
      slug: data.slug,
      isAvailable: data.isAvailable,
      isPromoted: data.isPromoted,
      createdAt: toDateSafe(data.createdAt, 'createdAt', snapshot.id),
      lastUpdated: toDateSafe(data.lastUpdated, 'lastUpdated', snapshot.id),
    };
  },
};