# 🔧 Correction : Installation des Dépendances Backend

## ❌ Problème
Le serveur backend ne démarre pas car le module `bcryptjs` n'est pas trouvé.

## ✅ Solution

### Option 1 : Installation Manuelle (Recommandé)

Ouvrez un terminal dans le dossier `backend` et exécutez :

```powershell
cd backend
npm install
```

Puis installez explicitement les packages manquants :

```powershell
npm install bcryptjs jsonwebtoken
```

### Option 2 : Utiliser le Script

Exécutez le fichier `install-deps.bat` dans le dossier `backend` :

```powershell
cd backend
.\install-deps.bat
```

### Option 3 : Commande Unique

Depuis la racine du projet :

```powershell
cd backend
npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2 --save
npm install
```

## ✅ Vérification

Après l'installation, vérifiez que les modules sont bien installés :

```powershell
cd backend
npm list bcryptjs jsonwebtoken
```

Vous devriez voir :
```
lifecycle-tracker-backend@1.0.0
├── bcryptjs@2.4.3
└── jsonwebtoken@9.0.2
```

## 🚀 Redémarrer le Serveur

Une fois les dépendances installées, redémarrez le serveur :

```powershell
cd backend
npm run dev
```

Le serveur devrait maintenant démarrer sans erreur !

---

**Si le problème persiste :**
1. Supprimez le dossier `node_modules` et le fichier `package-lock.json`
2. Exécutez `npm install` à nouveau
3. Vérifiez que vous êtes dans le bon répertoire (`backend`)
