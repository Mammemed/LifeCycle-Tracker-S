# 🚀 Migration vers Vercel - Étapes Complètes

## ✅ Oui, vous pouvez déployer TOUT sur Vercel !

En migrant les routes backend vers des **API Routes Next.js serverless**, vous pourrez déployer votre projet complet sur Vercel.

---

## 📦 Ce qui a été créé

### ✅ Fichiers créés
1. `frontend/lib/db/mongoose.ts` - Connexion MongoDB serverless
2. `frontend/lib/models/User.ts` - Modèle User TypeScript
3. `frontend/app/api/auth/register/route.ts` - Route d'inscription
4. `frontend/app/api/auth/login/route.ts` - Route de connexion
5. Dépendances ajoutées dans `package.json`:
   - `mongoose`, `bcryptjs`, `jsonwebtoken`
   - Types TypeScript correspondants

---

## 🔄 Ce qui reste à faire

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Créer les autres routes d'authentification

**`frontend/app/api/auth/me/route.ts`** - Obtenir l'utilisateur actuel
**`frontend/app/api/auth/logout/route.ts`** - Déconnexion

### 3. Créer le modèle Entity

**`frontend/lib/models/Entity.ts`** - Modèle Entity TypeScript

### 4. Migrer les routes Entities

- `frontend/app/api/entities/route.ts` (GET, POST)
- `frontend/app/api/entities/[id]/route.ts` (GET)
- `frontend/app/api/entities/[id]/status/route.ts` (PATCH)
- `frontend/app/api/entities/[id]/comments/route.ts` (POST)
- `frontend/app/api/entities/[id]/versions/route.ts` (GET, POST)
- `frontend/app/api/entities/[id]/versions/compare/route.ts` (GET)

### 5. Migrer les routes Statistics

- `frontend/app/api/statistics/summary/route.ts`
- `frontend/app/api/statistics/analytics/route.ts`
- `frontend/app/api/statistics/predictions/route.ts`
- `frontend/app/api/statistics/predictions/[id]/route.ts`

### 6. Migrer les routes Reports

- `frontend/app/api/reports/export/csv/route.ts`
- `frontend/app/api/reports/export/pdf/route.ts`

### 7. Créer les utilitaires

- Copier `backend/utils/statsUtils.js` → `frontend/lib/utils/statsUtils.ts`

### 8. Mettre à jour le client API

Changer `API_BASE_URL` dans `frontend/lib/api.ts` pour utiliser des chemins relatifs :
```typescript
const API_BASE_URL = '/api'  // Au lieu de 'http://localhost:5000/api'
```

### 9. Mettre à jour AuthContext

Changer `API_BASE_URL` dans `frontend/contexts/AuthContext.tsx` pour utiliser `/api`

---

## ⚙️ Configuration Vercel

### Variables d'environnement à configurer dans Vercel

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/lifecycle-tracker
JWT_SECRET=votre-clé-secrète-très-longue
JWT_EXPIRES_IN=7d
```

### Fichier `frontend/vercel.json` (optionnel)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

---

## 🚀 Déploiement

1. **Push vers GitHub**
2. **Connecter à Vercel** : https://vercel.com
3. **Importer le repository**
4. **Root Directory** : `frontend`
5. **Ajouter les variables d'environnement**
6. **Déployer !**

---

## ✅ Avantages

- ✅ Un seul déploiement sur Vercel
- ✅ Serverless (scalable automatiquement)
- ✅ HTTPS inclus
- ✅ CDN global
- ✅ Gratuit pour les petits projets

---

**Souhaitez-vous que je crée maintenant tous les fichiers restants pour compléter la migration ?**

Je peux créer :
- Toutes les routes API manquantes
- Le modèle Entity
- Les utilitaires
- Mettre à jour le client API

Dites-moi si je dois continuer ! 🚀
