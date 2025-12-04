# 🚀 Guide de Démarrage Rapide

## Démarrage des Serveurs

### Option 1: Démarrage Automatique (Recommandé)

Ouvrez **deux terminaux PowerShell** :

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 2: Démarrage Manuel

**Backend:**
```powershell
cd backend
node server.js
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

## ✅ Vérification

1. **Backend** devrait afficher:
   ```
   🚀 Server running on http://localhost:5000
   📡 API available at http://localhost:5000/api
   ❤️  Health check: http://localhost:5000/api/health
   ```

2. **Frontend** devrait afficher:
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   ```

3. **Test de connexion:**
   - Ouvrez votre navigateur: `http://localhost:3000`
   - Vérifiez la console du navigateur (F12) - ne devrait plus y avoir d'erreurs `ERR_CONNECTION_REFUSED`

## ⚠️ Si MongoDB n'est pas installé

Le serveur démarrera quand même, mais:
- Les opérations de base de données retourneront des tableaux vides
- Vous verrez un message d'avertissement dans la console

**Pour installer MongoDB:**
1. Téléchargez depuis: https://www.mongodb.com/try/download/community
2. Ou utilisez MongoDB Atlas (gratuit): https://www.mongodb.com/cloud/atlas
3. Mettez à jour `MONGO_URI` dans `backend/config.js` ou créez un fichier `.env`

## 🔧 Dépannage

**Port 5000 déjà utilisé:**
```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Arrêter le processus (remplacez PID par le numéro trouvé)
taskkill /PID <PID> /F
```

**Erreurs de connexion:**
- Vérifiez que les deux serveurs sont bien démarrés
- Vérifiez que les ports 3000 et 5000 ne sont pas utilisés par d'autres applications
- Vérifiez la console du navigateur pour les erreurs détaillées

