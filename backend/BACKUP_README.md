# 📦 Système de Backup MongoDB - E-Commerce

Ce système permet de créer, restaurer et gérer des backups de votre base de données MongoDB en utilisant la bibliothèque `fs` et des **promises**.

## 🚀 Fonctionnalités

- ✅ **Créer des backups** complets de toutes les collections
- ✅ **Restaurer** depuis un fichier de backup
- ✅ **Lister** tous les backups disponibles
- ✅ **Nettoyer** automatiquement les anciens backups
- ✅ **Backup automatique** avec nettoyage intégré
- ✅ **API REST** pour gérer les backups depuis votre application
- ✅ **CLI** pour gérer les backups en ligne de commande

## 📁 Structure des fichiers

```
backend/
├── utils/
│   └── backup.js           # Fonctions de backup/restore
├── routes/
│   └── backup.js           # Routes API pour les backups
├── backup-cli.js           # Script CLI pour gérer les backups
└── backups/                # Dossier où sont stockés les backups (créé automatiquement)
```

## 🔧 Utilisation CLI

### 1. Créer un backup

```bash
node backup-cli.js create
```

### 2. Lister les backups disponibles

```bash
node backup-cli.js list
```

### 3. Restaurer un backup

```bash
node backup-cli.js restore ./backups/backup-2025-12-03T17-00-00-000Z.json
```

### 4. Nettoyer les anciens backups (garder les 5 plus récents)

```bash
node backup-cli.js clean 5
```

### 5. Backup automatique (créer + nettoyer)

```bash
node backup-cli.js auto 5
```

### 6. Afficher l'aide

```bash
node backup-cli.js help
```

## 🌐 Utilisation via API

Toutes les routes nécessitent une authentification **admin**.

### 1. Créer un backup

```http
POST /api/backup/create
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "status": "success",
  "message": "Backup créé avec succès",
  "data": {
    "backupPath": "./backups/backup-2025-12-03T17-00-00-000Z.json"
  }
}
```

### 2. Créer un backup automatique

```http
POST /api/backup/auto
Authorization: Bearer <token>
Content-Type: application/json

{
  "keepCount": 5
}
```

### 3. Lister tous les backups

```http
GET /api/backup/list
Authorization: Bearer <token>
```

**Réponse:**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "backups": [
      {
        "filename": "backup-2025-12-03T17-00-00-000Z.json",
        "path": "./backups/backup-2025-12-03T17-00-00-000Z.json",
        "size": "2.45 MB",
        "created": "2025-12-03T17:00:00.000Z",
        "metadata": {
          "timestamp": "2025-12-03T17:00:00.000Z",
          "collections": {
            "users": 10,
            "products": 50,
            "carts": 5,
            "orders": 20
          }
        }
      }
    ]
  }
}
```

### 4. Restaurer un backup

```http
POST /api/backup/restore
Authorization: Bearer <token>
Content-Type: application/json

{
  "backupPath": "./backups/backup-2025-12-03T17-00-00-000Z.json",
  "clearBeforeRestore": true
}
```

### 5. Nettoyer les anciens backups

```http
DELETE /api/backup/clean
Authorization: Bearer <token>
Content-Type: application/json

{
  "keepCount": 5
}
```

## 📊 Format du fichier de backup

Les backups sont stockés au format JSON avec la structure suivante:

```json
{
  "metadata": {
    "timestamp": "2025-12-03T17:00:00.000Z",
    "version": "1.0",
    "database": "ecommerce",
    "collections": {
      "users": 10,
      "products": 50,
      "carts": 5,
      "orders": 20
    }
  },
  "data": {
    "users": [...],
    "products": [...],
    "carts": [...],
    "orders": [...]
  }
}
```

## 🔄 Utilisation programmatique

Vous pouvez aussi utiliser les fonctions de backup directement dans votre code:

```javascript
const {
    createBackup,
    restoreBackup,
    listBackups,
    cleanOldBackups,
    autoBackup
} = require('./utils/backup');

// Créer un backup
createBackup('./backups')
    .then((backupPath) => {
        console.log('Backup créé:', backupPath);
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });

// Restaurer un backup
restoreBackup('./backups/backup-2025-12-03.json', true)
    .then((stats) => {
        console.log('Restauration terminée:', stats);
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });

// Lister les backups
listBackups('./backups')
    .then((backups) => {
        console.log('Backups disponibles:', backups);
    });

// Nettoyer les anciens backups
cleanOldBackups(5, './backups')
    .then((deletedCount) => {
        console.log(`${deletedCount} backups supprimés`);
    });

// Backup automatique
autoBackup('./backups', 5)
    .then((backupPath) => {
        console.log('Backup automatique créé:', backupPath);
    });
```

## ⚙️ Configuration

### Variables d'environnement

Assurez-vous que votre fichier `.env` contient:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=votre_secret_jwt
```

## 🔒 Sécurité

- ⚠️ Les backups contiennent **toutes les données** y compris les mots de passe hashés
- 🔐 Stockez les backups dans un endroit **sécurisé**
- 🚫 N'exposez **jamais** les backups publiquement
- 👥 Seuls les **administrateurs** peuvent créer/restaurer des backups via l'API

## 📝 Bonnes pratiques

1. **Backups réguliers**: Créez des backups automatiques quotidiens
2. **Rotation**: Gardez un nombre limité de backups (ex: 7 derniers jours)
3. **Test de restauration**: Testez régulièrement la restauration
4. **Stockage externe**: Copiez les backups vers un stockage cloud (S3, Google Cloud, etc.)

## 🛠️ Automatisation

### Backup quotidien avec cron (Linux/Mac)

```bash
# Ajouter dans crontab
0 2 * * * cd /chemin/vers/backend && node backup-cli.js auto 7
```

### Backup quotidien avec Task Scheduler (Windows)

Créez une tâche planifiée qui exécute:
```
node C:\chemin\vers\backend\backup-cli.js auto 7
```

## ❓ Dépannage

### Erreur: "ENOENT: no such file or directory"
- Vérifiez que le chemin du fichier de backup est correct
- Le répertoire `backups` sera créé automatiquement

### Erreur: "MongoDB non connecté"
- Vérifiez votre variable `MONGO_URI` dans `.env`
- Assurez-vous que MongoDB est démarré

### Backup trop volumineux
- Les backups JSON peuvent être volumineux
- Envisagez d'utiliser `mongodump` pour de très grandes bases de données

## 📚 Collections sauvegardées

- ✅ **Users** (Utilisateurs)
- ✅ **Products** (Produits)
- ✅ **Carts** (Paniers)
- ✅ **Orders** (Commandes)

## 🎯 Exemple complet

```bash
# 1. Créer un backup
node backup-cli.js create

# 2. Lister les backups
node backup-cli.js list

# 3. Restaurer le backup le plus récent
node backup-cli.js restore ./backups/backup-2025-12-03T17-00-00-000Z.json

# 4. Nettoyer en gardant les 3 plus récents
node backup-cli.js clean 3
```

## 🌟 Fonctionnalités avancées

### Ajouter de nouvelles collections

Pour sauvegarder d'autres collections, modifiez `utils/backup.js`:

```javascript
// Ajouter l'import du modèle
const Review = require('../models/Review');

// Dans createBackup(), ajouter à Promise.all:
Promise.all([
    User.find({}).lean(),
    Product.find({}).lean(),
    Cart.find({}).populate('articles.produit').lean(),
    Order.find({}).populate('utilisateur').lean(),
    Review.find({}).lean()  // Nouvelle collection
])

// Mettre à jour backupData.data:
data: {
    users,
    products,
    carts,
    orders,
    reviews  // Nouvelle collection
}
```

---

**Développé avec ❤️ en utilisant uniquement des Promises (pas d'async/await)**
