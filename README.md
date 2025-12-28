# Site E-commerce AtlasSun - Excellence de l'Artisanat Marocain

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)


Site E-commerce AtlasSun est une plateforme moderne dédiée à la promotion et à la vente de produits artisanaux marocains de haute qualité (Caftans, bijoux, babouches, etc.).

-------

## 🚀 Fonctionnalités Clés

- **Catalogue Dynamique** : Navigation et recherche fluide parmi les catégories d'artisanat.
- **Authentification Avancée** : Système sécurisé avec support de la Double Authentification (2FA).
- **Profil Utilisateur** : Gestion complète du profil avec photo (avatar) persistante.
- **Favoris & Panier** : Expérience d'achat complète avec gestion des souhaits.
- **Système de Backup** : Sauvegarde JSON automatisée utilisant exclusivement la bibliothèque `fs`.

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [MongoDB](https://www.mongodb.com/try/download/community) (tournant localement ou via Atlas)

## 📦 Installation & Configuration

### 1. Cloner le Projet
Clonez le dépôt GitHub sur votre machine locale :
```bash
git clone https://github.com/votre-username/site-ecommerce-atlassun.git
cd site-ecommerce-atlassun
```

### 2. Prérequis (Important)
L'installation de **MongoDB** est **essentielle**. Vous avez deux options :
- **Installation Locale** : Téléchargez [MongoDB Community Server](https://www.mongodb.com/try/download/community) et lancez-le sur votre PC.
- **MongoDB Atlas (Cloud)** : Utilisez une base de données gratuite dans le cloud.

## 📦 Installation des Dépendances
Installez les modules nécessaires pour chaque partie :

### 1. Installation du Backend
```bash
cd backend
npm install
```
*Cette commande télécharge Express, Mongoose, JWT, Bcryptjs, Nodemailer, etc.*

### 2. Installation du Frontend
```bash
cd ../frontend
npm install
```
*Cette commande télécharge Angular et toutes ses dépendances de développement.*

## ⚙️ Configuration

### Configuration du Backend
1. Restez dans le dossier `backend`.
2. Créez un fichier `.env` (utilisez `.env.example` comme modèle).
3. Configurez vos accès (MongoDB, Email pour les notifications).

### Initialisation des Données
Pour remplir votre catalogue et les comptes utilisateurs de démonstration :
```bash
cd backend
node seed-full.js  # Recommandé : Remplit tout (Produits + Admin + Clients)
```
*Note : Vous pouvez aussi utiliser `node seed-products.js` pour les produits uniquement.*

## 🏃 Lancement du Projet

Pour démarrer l'application en mode développement :

1. **Démarrer le Serveur API (Backend)** :
   ```bash
   cd backend
   npm run dev
   ```

2. **Démarrer l'Interface Client (Frontend)** :
   ```bash
   cd frontend
   ng serve
   ```
   L'application sera lancée sur `http://localhost:4200`.

## 👤 Comptes de Test

Pour tester les fonctionnalités d'administration et de gestion :

- **Rôle Admin** :
  - **Email** : `admin@atlassun.com`
  - **Mot de passe** : `Admin123!`

### 💾 Portabilité & Sauvegarde
Le projet inclut un système complet de gestion des données utilisant exclusivement la bibliothèque standard `fs` pour une portabilité maximale :
- **Backups JSON** : Toutes les données sont exportées dans `backend/backups/`.
- **Portabilité GitHub** : En faisant un `push`, vos fichiers JSON montent sur GitHub, permettant à n'importe quel développeur de restaurer l'état exact de la boutique.
- **Commande de Backup** : `node auto-backup-scheduler.js once` (crée instantanément un instantané de la base).

### 1. Gestionnaire de Backup (CLI)
Utilisez cet outil pour gérer manuellement vos sauvegardes :
```bash
cd backend
node backup-cli.js help     # Afficher l'aide
node backup-cli.js create   # Créer un backup immédiat
node backup-cli.js list     # Lister tous les backups
node backup-cli.js restore  # Restaurer un fichier spécifique
```

### 2. Sauvegarde Automatique (Background)
Pour planifier des sauvegardes régulières (ex: chaque nuit) :
```bash
cd backend
node auto-backup-scheduler.js schedule
```

Les fichiers sont stockés en format JSON dans `backend/backups/`. Ce système illustre l'utilisation avancée du module **FileSystem (fs)** de Node.js pour la persistence des données.

---

