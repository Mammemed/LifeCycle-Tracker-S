# 🔧 Guide de Dépannage

## Erreur 400 (Bad Request) lors de la création d'entité

### Causes possibles :

1. **MongoDB n'est pas connecté**
   - Vérifiez que MongoDB est installé et en cours d'exécution
   - Vérifiez la connexion : `http://localhost:5000/api/health`
   - Le champ `mongodb.connected` devrait être `true`

2. **Titre vide ou invalide**
   - Le titre est obligatoire et ne peut pas être vide
   - Vérifiez que le formulaire envoie bien un titre

3. **Erreur de validation Mongoose**
   - Vérifiez les logs du serveur backend pour voir les détails de l'erreur
   - Les erreurs de validation sont maintenant affichées dans la console

### Solutions :

#### Solution 1 : Vérifier MongoDB

```powershell
# Vérifier si MongoDB est en cours d'exécution
Get-Service -Name MongoDB -ErrorAction SilentlyContinue

# Ou vérifier le processus
Get-Process -Name mongod -ErrorAction SilentlyContinue
```

Si MongoDB n'est pas installé :
1. Téléchargez depuis : https://www.mongodb.com/try/download/community
2. Ou utilisez MongoDB Atlas (gratuit) : https://www.mongodb.com/cloud/atlas

#### Solution 2 : Vérifier la connexion

Ouvrez dans votre navigateur : `http://localhost:5000/api/health`

Vous devriez voir :
```json
{
  "status": "ok",
  "mongodb": {
    "state": 1,
    "stateName": "connected",
    "connected": true
  }
}
```

Si `connected` est `false`, MongoDB n'est pas connecté.

#### Solution 3 : Vérifier les logs

Regardez la console du serveur backend. Vous devriez voir :
- L'état de la connexion MongoDB
- Les détails de la requête
- Les erreurs spécifiques

#### Solution 4 : Tester avec curl/Postman

```powershell
# Test de création d'entité
curl -X POST http://localhost:5000/api/entities `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Entity\",\"description\":\"Test\",\"initialStatus\":\"draft\"}'
```

## Erreurs courantes

### ERR_CONNECTION_REFUSED
- Le serveur backend n'est pas démarré
- Solution : Démarrez le backend avec `cd backend && npm run dev`

### 503 Service Unavailable
- MongoDB n'est pas connecté
- Solution : Installez et démarrez MongoDB

### 400 Bad Request
- Données invalides dans la requête
- Vérifiez les logs du serveur pour les détails
- Vérifiez que tous les champs requis sont remplis

## Vérification rapide

1. **Backend fonctionne ?**
   ```powershell
   curl http://localhost:5000/api/health
   ```

2. **Frontend fonctionne ?**
   - Ouvrez `http://localhost:3000`
   - Vérifiez la console du navigateur (F12)

3. **MongoDB connecté ?**
   - Vérifiez `http://localhost:5000/api/health`
   - Regardez les logs du serveur backend

## Logs utiles

Les logs du serveur backend affichent maintenant :
- L'état de la connexion MongoDB
- Les détails des requêtes (méthode, URL, body)
- Les erreurs détaillées avec stack trace

