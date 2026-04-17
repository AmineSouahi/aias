# Guide : Configuration d'un Personal Access Token GitHub

## Étape 1 : Créer un Personal Access Token sur GitHub

1. **Connectez-vous à GitHub** : Allez sur https://github.com et connectez-vous à votre compte

2. **Accédez aux paramètres** :
   - Cliquez sur votre photo de profil en haut à droite
   - Cliquez sur **"Settings"** (Paramètres)

3. **Accédez aux Developer settings** :
   - Dans le menu de gauche, faites défiler vers le bas
   - Cliquez sur **"Developer settings"** (en bas de la liste)

4. **Accédez aux Personal access tokens** :
   - Dans le menu de gauche, cliquez sur **"Personal access tokens"**
   - Puis cliquez sur **"Tokens (classic)"** ou **"Fine-grained tokens"**
   - **Recommandation** : Utilisez **"Tokens (classic)"** pour plus de simplicité

5. **Générer un nouveau token** :
   - Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
   - GitHub vous demandera votre mot de passe pour confirmer

6. **Configurer le token** :
   - **Note** : Donnez un nom descriptif, par exemple : "AIAIS Repository Access"
   - **Expiration** : Choisissez une durée (90 jours, 1 an, ou "No expiration")
   - **Scopes (Permissions)** : Cochez au minimum :
     - ✅ **repo** (accès complet aux dépôts)
       - Cela inclut : repo:status, repo_deployment, public_repo, repo:invite, security_events

7. **Générer et copier le token** :
   - Cliquez sur **"Generate token"** en bas de la page
   - **⚠️ IMPORTANT** : Copiez immédiatement le token affiché (il commence par `ghp_`)
   - Vous ne pourrez plus le voir après avoir quitté cette page !
   - Collez-le dans un fichier texte temporaire pour ne pas le perdre

## Étape 2 : Configurer Git avec le token

Une fois que vous avez votre token (par exemple : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`), suivez ces étapes :

### Option A : Utiliser le token dans l'URL du remote

```powershell
# Remplacez VOTRE_TOKEN par le token que vous avez copié
git remote set-url origin https://VOTRE_TOKEN@github.com/AmineSouahi/aias.git
```

**Exemple concret** :
Si votre token est `ghp_abc123def456ghi789jkl012mno345pqr678`, la commande serait :
```powershell
git remote set-url origin https://ghp_abc123def456ghi789jkl012mno345pqr678@github.com/AmineSouahi/aias.git
```

### Option B : Utiliser votre nom d'utilisateur GitHub avec le token

```powershell
# Remplacez VOTRE_TOKEN par le token et VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote set-url origin https://VOTRE_USERNAME:VOTRE_TOKEN@github.com/AmineSouahi/aias.git
```

**Exemple concret** :
Si votre nom d'utilisateur est `AmineSouahi` et votre token est `ghp_abc123...`, la commande serait :
```powershell
git remote set-url origin https://AmineSouahi:ghp_abc123def456ghi789jkl012mno345pqr678@github.com/AmineSouahi/aias.git
```

## Étape 3 : Vérifier la configuration

Vérifiez que l'URL a bien été mise à jour :
```powershell
git remote -v
```

Vous devriez voir quelque chose comme :
```
origin  https://ghp_xxxxx@github.com/AmineSouahi/aias.git (fetch)
origin  https://ghp_xxxxx@github.com/AmineSouahi/aias.git (push)
```

## Étape 4 : Pousser les changements

Maintenant, vous pouvez pousser vos commits :
```powershell
# Désactiver le proxy pour cette session
$env:GIT_HTTP_PROXY=''
$env:GIT_HTTPS_PROXY=''

# Pousser les commits
git -c http.proxy= -c https.proxy= push origin main
```

## Étape 5 : Ajouter les fichiers vidéo avec Git LFS (après le push)

Une fois les commits poussés, ajoutez les fichiers vidéo :
```powershell
git add public/video/
git commit -m "Add video files with Git LFS"
git -c http.proxy= -c https.proxy= push origin main
```

## Sécurité

⚠️ **Important** : 
- Ne partagez jamais votre token avec d'autres personnes
- Ne commitez jamais votre token dans le dépôt Git
- Si votre token est compromis, révoquez-le immédiatement sur GitHub
- Le token apparaîtra dans l'historique Git si vous l'utilisez dans l'URL. Pour plus de sécurité, utilisez Git Credential Manager (option 1)

## Révoquer un token (si nécessaire)

Si vous devez révoquer un token :
1. Allez sur GitHub → Settings → Developer settings → Personal access tokens
2. Trouvez le token que vous voulez révoquer
3. Cliquez sur "Revoke" à côté du token
