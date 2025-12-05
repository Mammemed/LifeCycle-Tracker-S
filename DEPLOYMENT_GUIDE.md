# 🚀 Guide de Déploiement - LifeCycle Tracker

## 📋 Architecture Actuelle

- **Frontend** : Next.js 14 (App Router) + TypeScript
- **Backend** : Express.js + MongoDB + Mongoose
- **Séparation** : Backend et Frontend sont dans des dossiers séparés

## 🎯 Solution Recommandée : Déploiement Séparé

### Frontend sur Vercel
### Backend sur Railway/Render/Heroku

---

## 📦 Option 1 : Déploiement Complet (Recommandé)

### Partie 1 : Déployer le Backend

#### A. Railway (Recommandé - Gratuit avec limite)

1. **Créer un compte** : https://railway.app

2. **Déployer le Backend** :
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Railway détectera automatiquement Node.js
   - Configurez les variables d'environnement :

```env
PORT=5000
MONGO_URI=<votre-uri-mongodb-atlas>
JWT_SECRET=<votre-clé-secrète-très-longue>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

3. **Root Directory** : Configurez `/backend` comme root directory

4. **Start Command** : `npm start`

5. **Obtenez l'URL du backend** : `https://votre-backend.railway.app`

---

#### B. Render (Alternative - Gratuit avec limite)

1. **Créer un compte** : https://render.com

2. **Nouveau Web Service** :
   - Connectez votre repository GitHub
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Environment** : Node

3. **Variables d'environnement** :
```env
PORT=5000
MONGO_URI=<votre-uri-mongodb-atlas>
JWT_SECRET=<votre-clé-secrète>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

4. **Obtenez l'URL** : `https://votre-backend.onrender.com`

---

### Partie 2 : Déployer le Frontend sur Vercel

1. **Créer un compte Vercel** : https://vercel.com

2. **Installer Vercel CLI** (optionnel) :
```bash
npm install -g vercel
```

3. **Déployer depuis GitHub** :
   - Connectez votre repository GitHub à Vercel
   - Configurez le projet :
     - **Framework Preset** : Next.js
     - **Root Directory** : `frontend`
     - **Build Command** : `npm run build`
     - **Output Directory** : `.next`

4. **Variables d'environnement** dans Vercel :
   - Allez dans Settings > Environment Variables
   - Ajoutez :

```env
NEXT_PUBLIC_API_URL=https://votre-backend.railway.app/api
```

**Important** : Remplacez `https://votre-backend.railway.app` par l'URL réelle de votre backend déployé !

5. **Redeploy** après avoir ajouté les variables

---

## 🔧 Configuration Requise

### 1. Préparer le Backend pour la Production

Créez un fichier `backend/vercel.json` ou `backend/railway.json` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 2. Mettre à jour le package.json du Backend

Vérifiez que le script `start` existe :

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. CORS Configuration

Le backend doit autoriser les requêtes depuis votre domaine Vercel. Mettez à jour `backend/server.js` :

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📝 Fichiers de Configuration à Créer

### 1. `frontend/.env.production` (optionnel)

```env
NEXT_PUBLIC_API_URL=https://votre-backend.railway.app/api
```

### 2. `backend/.env` (à créer sur la plateforme de déploiement)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/lifecycle-tracker?retryWrites=true&w=majority
JWT_SECRET=votre-clé-secrète-très-longue-et-complexe-changez-moi
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://votre-app.vercel.app
```

### 3. `frontend/vercel.json`

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://votre-backend.railway.app/api/$1"
    }
  ]
}
```

---

## 🗄️ MongoDB Atlas (Requis pour la Production)

1. **Créer un compte** : https://www.mongodb.com/cloud/atlas

2. **Créer un cluster** (gratuit)

3. **Obtenir la connection string** :
   - Database Access > Add New Database User
   - Network Access > Add IP Address (0.0.0.0/0 pour permettre toutes les IPs)
   - Connect > Connect your application
   - Copiez la connection string

4. **Mettez à jour MONGO_URI** avec votre connection string

---

## ✅ Checklist de Déploiement

### Backend
- [ ] Backend déployé sur Railway/Render
- [ ] MongoDB Atlas configuré
- [ ] Variables d'environnement configurées
- [ ] CORS configuré pour autoriser le domaine frontend
- [ ] URL du backend obtenue et testée

### Frontend
- [ ] Frontend déployé sur Vercel
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée dans Vercel
- [ ] Build réussi
- [ ] Application accessible

### Tests
- [ ] Backend health check fonctionne
- [ ] Frontend peut se connecter au backend
- [ ] Authentification fonctionne
- [ ] CRUD des entités fonctionne

---

## 🔍 Dépannage

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend pointe vers votre domaine Vercel
- Vérifiez la configuration CORS dans `backend/server.js`

### Erreur de connexion API
- Vérifiez que `NEXT_PUBLIC_API_URL` est correctement configuré dans Vercel
- Vérifiez que l'URL du backend est accessible (testez dans le navigateur)

### Erreur MongoDB
- Vérifiez que l'IP de votre plateforme backend est autorisée dans MongoDB Atlas
- Vérifiez la connection string MongoDB

---

## 📱 Alternative : Monorepo sur Vercel

Si vous voulez tout déployer sur Vercel, vous devrez convertir les routes backend en API Routes Next.js. C'est plus complexe mais possible.

---

**Prochaines étapes :** Suivez Partie 1 puis Partie 2 pour déployer votre application complète ! 🚀
