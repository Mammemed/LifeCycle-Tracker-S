# 🚀 Serveurs Lancés

## ✅ Backend (Express.js)

**Port:** `5000`  
**URL:** http://localhost:5000  
**API:** http://localhost:5000/api  
**Health Check:** http://localhost:5000/api/health

**Commandes disponibles:**
- `npm run dev` - Démarrage en mode développement (nodemon)
- `npm start` - Démarrage en mode production

**Routes API disponibles:**
- `/api/auth/*` - Authentification
- `/api/entities/*` - Gestion des entités
- `/api/statistics/*` - Statistiques
- `/api/reports/*` - Export de rapports

---

## ✅ Frontend (Next.js)

**Port:** `3000`  
**URL:** http://localhost:3000  
**Redirection automatique:** `/dashboard` (si authentifié) ou `/login` (si non authentifié)

**Commandes disponibles:**
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build pour production
- `npm start` - Démarrage en mode production

**Pages disponibles:**
- `/login` - Page de connexion/inscription
- `/dashboard` - Tableau de bord principal
- `/entities/new` - Créer une nouvelle entité
- `/entities/[id]` - Détails d'une entité
- `/statistics` - Statistiques et analytics
- `/predictions` - Prédictions IA

---

## 🎯 Comment Utiliser

1. **Backend démarré** - Le serveur Express tourne sur le port 5000
2. **Frontend démarré** - L'application Next.js tourne sur le port 3000

### Accéder à l'application :

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3000**
3. Vous serez redirigé vers `/login` si vous n'êtes pas connecté
4. Créez un compte ou connectez-vous
5. Profitez de l'application ! 🎉

---

## 🔧 Commandes pour Arrêter les Serveurs

### Dans les terminaux où ils tournent :
- Appuyez sur `Ctrl + C` pour arrêter chaque serveur

### Ou depuis un nouveau terminal :

**Backend :**
```powershell
# Trouver et arrêter le processus Node.js du backend
Get-Process -Name node | Where-Object {$_.Path -like "*backend*"} | Stop-Process
```

**Frontend :**
```powershell
# Trouver et arrêter le processus Node.js du frontend
Get-Process -Name node | Where-Object {$_.Path -like "*frontend*"} | Stop-Process
```

---

## ⚠️ Notes

- Les serveurs tournent en arrière-plan
- Les logs sont disponibles dans les fichiers de terminal
- Le backend doit être démarré avant le frontend pour éviter les erreurs de connexion
- MongoDB doit être en cours d'exécution pour que les fonctionnalités de base de données fonctionnent

---

## ✅ Status

- ✅ Backend : **EN COURS D'EXÉCUTION**
- ✅ Frontend : **EN COURS D'EXÉCUTION**
- 🔗 **Prêt à utiliser !**
