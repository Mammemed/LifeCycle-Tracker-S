# 🚀 Migration Backend → API Routes Vercel

## ✅ Oui, vous pouvez déployer TOUT sur Vercel !

En migrant les routes backend Express vers des **API Routes Next.js**, vous pourrez déployer le projet complet sur Vercel.

---

## 📋 Ce qui sera fait

1. ✅ Créer des modèles Mongoose en TypeScript dans le frontend
2. ✅ Créer des API Routes Next.js (`/app/api/*`)
3. ✅ Migrer tous les contrôleurs backend
4. ✅ Créer un utilitaire de connexion MongoDB serverless
5. ✅ Mettre à jour le client API frontend
6. ✅ Configurer Vercel

---

## 🏗️ Structure après migration

```
frontend/
├── app/
│   ├── api/                    # ← NOUVELLES API Routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   ├── me/
│   │   │   └── logout/
│   │   ├── entities/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   ├── statistics/
│   │   └── reports/
│   └── ... (pages existantes)
├── lib/
│   ├── db/
│   │   └── mongoose.ts         # ← Connexion MongoDB serverless
│   └── models/                 # ← Modèles Mongoose TypeScript
│       ├── User.ts
│       └── Entity.ts
└── ...
```

---

## 📝 Étapes de Migration

### Étape 1 : Installation des dépendances frontend

Ajouter les packages nécessaires dans `frontend/package.json` :

```json
{
  "dependencies": {
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

### Étape 2 : Créer les modèles Mongoose

- `frontend/lib/models/User.ts`
- `frontend/lib/models/Entity.ts`

### Étape 3 : Créer les API Routes

- `/app/api/auth/register/route.ts`
- `/app/api/auth/login/route.ts`
- `/app/api/auth/me/route.ts`
- `/app/api/entities/route.ts`
- `/app/api/entities/[id]/route.ts`
- etc.

### Étape 4 : Mettre à jour le client API

Changer `API_BASE_URL` pour utiliser des chemins relatifs (`/api/...`)

---

## ⚠️ Important

Après la migration :
- ✅ Tout sera dans le frontend
- ✅ Plus besoin du dossier `backend/` pour Vercel
- ✅ Un seul déploiement Vercel
- ✅ MongoDB Atlas toujours requis pour la base de données

---

## 🚀 Déploiement final

Une fois migré :
1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer !
4. Tout fonctionnera sur Vercel ! 🎉

---

**Je vais maintenant créer tous les fichiers nécessaires pour cette migration !**
