# 🍔 [Crazee-burger-adm]

> Application web de gestion de menu pour restaurant : les administrateurs gèrent leurs produits en temps réel (ajout, modification, suppression, disponibilité, mise en avant).

🔗 **Démo en ligne : [https://https://crazee-burger-dev-adm.firebaseapp.com/](https://https://crazee-burger-dev-adm.firebaseapp.com/)**

![Aperçu de l'application](./docs/wip_screenshot.jpg)

---

## 🔑 Tester l'application

Un compte de démonstration est disponible :

| Email | Mot de passe |
|---|---|
| `demo@exemple.com` | `CrazeeBurger123*` |

> Les données de démonstration sont réinitialisées régulièrement.

---

## ✨ Fonctionnalités

- **Authentification** : inscription, connexion, déconnexion, réinitialisation du mot de passe par email
- **Gestion des produits (CRUD)** : ajout, modification et suppression de produits
- **Synchronisation en temps réel** avec Firestore
- **Gestion de la disponibilité** (produit en stock / épuisé) et **mise en avant** de produits
- **Catégories** : Burger, Boisson, Supplément
- **Design responsive** : utilisable sur mobile, tablette et ordinateur
- **Accès sécurisé** : seuls les administrateurs peuvent consulter et modifier le menu

---

## 🛠️ Stack technique

| Domaine | Technologies |
|---|---|
| Front-end | React, TypeScript, Vite |
| Style | Tailwind CSS |
| Navigation | React Router |
| Back-end (BaaS) | Firebase Authentication, Cloud Firestore |
| Hébergement | Firebase Hosting |

---

## 🔒 Sécurité

La sécurité des données ne repose pas sur l'interface, mais sur les **règles de sécurité Firestore** ([`firestore.rules`](./firestore.rules)), versionnées dans ce dépôt :

- **Accès refusé par défaut** : toute collection non déclarée est inaccessible.
- **Gestion des rôles** : seuls les utilisateurs présents dans la collection `admins` peuvent lire et modifier les produits. Cette collection n'est modifiable que depuis la console Firebase.
- **Validation des données côté serveur** : chaque produit est vérifié avant écriture (champs autorisés et obligatoires, types, longueur du nom, catégorie, prix et quantité positifs).
- **Intégrité** : la date de création d'un produit ne peut pas être modifiée.

---

## 📖 Origine du projet

Ce projet est né lors de la formation **Développeur React — Vi-Dev**, où j'ai réalisé une première version en JavaScript avec Firebase et Styled-components.

Je l'ai ensuite **repris et fait évoluer seul** :

- Migration complète de **JavaScript vers TypeScript**
- Ajout de l'**authentification** (inscription, connexion, réinitialisation du mot de passe)
- Nouveau **design responsive** avec **Tailwind CSS**
- Écriture des **règles de sécurité Firestore** (rôles, validation des données)
- **Déploiement** sur Firebase Hosting

---

## 🚀 Installation en local

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS)
- Un projet [Firebase](https://console.firebase.google.com/) avec Authentication (email/mot de passe) et Firestore activés

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/[ton-pseudo]/[nom-du-repo].git
cd [nom-du-repo]

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# puis renseigner les valeurs de ton projet Firebase dans .env

# 4. Lancer le serveur de développement
npm run dev
```

### Variables d'environnement

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Génère la version de production dans `dist/` |
| `npm run preview` | Prévisualise la version de production en local |
| `npm run lint` | Analyse le code avec ESLint |

---

## ☁️ Déploiement

L'application est hébergée sur **Firebase Hosting**.

```bash
npm run build
firebase deploy --only hosting          # déployer l'application
firebase deploy --only firestore:rules  # déployer les règles de sécurité
```

---

## 🗺️ Évolutions prévues

- [ ] Tests unitaires et d'intégration (Vitest, React Testing Library)
- [ ] Intégration continue et déploiement automatique (GitHub Actions)
- [ ] Séparation en deux applications : **back-office administrateur** et **application client** de commande

---

## 👤 Auteur

**[Loris LETIERCE]** — Développeur React junior, en recherche d'emploi

[LinkedIn](https://www.linkedin.com/in/loris-letierce-9863a1159) · [GitHub](https://github.com/lletierce) · [Email](mailto:letierce.lo@gmail.com)
