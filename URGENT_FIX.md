# ⚠️ CORRECTION URGENTE : Dépendances Backend Manquantes

## 🔴 Problème Actuel

Le serveur backend ne peut pas démarrer car `bcryptjs` n'est pas installé.

**Erreur :** `Error: Cannot find module 'bcryptjs'`

## ✅ Solution Immédiate

### Étape 1 : Ouvrir un Terminal dans le dossier Backend

1. Ouvrez PowerShell ou Command Prompt
2. Naviguez vers le dossier backend :

```powershell
cd "c:\Users\lapto\OneDrive\Bureau\LifeCycle\backend"
```

### Étape 2 : Installer les Dépendances

Exécutez cette commande :

```powershell
npm install
```

Cela installera TOUTES les dépendances listées dans `package.json`, y compris :
- ✅ bcryptjs
- ✅ jsonwebtoken
- ✅ express
- ✅ mongoose
- ✅ cors
- ✅ dotenv
- ✅ nodemon

### Étape 3 : Vérifier l'Installation

Vérifiez que les modules sont installés :

```powershell
npm list bcryptjs jsonwebtoken
```

Vous devriez voir les versions installées.

### Étape 4 : Redémarrer le Serveur

Une fois l'installation terminée, redémarrez le serveur :

```powershell
npm run dev
```

Le serveur devrait maintenant démarrer correctement ! ✅

---

## 🔍 Si ça ne fonctionne toujours pas

### Option A : Installation Explicite

Installez les packages manuellement :

```powershell
npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2 --save
```

### Option B : Nettoyer et Réinstaller

1. Supprimez `node_modules` et `package-lock.json` :

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

2. Réinstallez tout :

```powershell
npm install
```

---

## 📝 Commandes Complètes (Copier-Coller)

```powershell
# 1. Aller dans le dossier backend
cd "c:\Users\lapto\OneDrive\Bureau\LifeCycle\backend"

# 2. Installer les dépendances
npm install

# 3. Vérifier l'installation
npm list bcryptjs jsonwebtoken

# 4. Démarrer le serveur
npm run dev
```

---

## ✅ Résultat Attendu

Après `npm install`, vous devriez voir :
- Un dossier `node_modules` créé dans `backend/`
- Les packages installés listés
- Le serveur qui démarre sans erreur

---

**Une fois que c'est fait, le backend fonctionnera et vous pourrez utiliser l'application !** 🚀
