# 🔧 Solution : ViteManifestNotFoundException

## ❌ Erreur actuelle
```
Vite manifest not found at: /home/u507670352/domains/aiais.org/public_html/build/manifest.json
```

## ✅ Solution : Uploader le dossier `build/`

Le dossier `public/build/` n'a pas été uploadé sur Hostinger. Voici comment le corriger :

### Méthode 1 : Via FTP/SFTP (FileZilla, WinSCP, etc.)

1. **Connectez-vous à votre compte Hostinger via FTP**
   - Hôte : `ftp.aiais.org` ou l'adresse FTP fournie par Hostinger
   - Utilisateur : Votre nom d'utilisateur FTP
   - Mot de passe : Votre mot de passe FTP

2. **Naviguez vers le dossier `public_html/`**

3. **Uploadez le dossier `build/` complet :**
   - Sur votre ordinateur : `C:\Users\amine\Desktop\AIAIS\aiais\public\build\`
   - Sur Hostinger : `public_html/build/`
   
   **Structure attendue sur Hostinger :**
   ```
   public_html/
   ├── build/                    ← ⚠️ CE DOSSIER MANQUE !
   │   ├── manifest.json
   │   └── assets/
   │       ├── app-C50sj5x0.js
   │       ├── app-DvJMKyRs.css
   │       └── browser-ponyfill-oR2XOutU.js
   ├── index.php
   ├── .htaccess
   └── ...
   ```

4. **Vérifiez que les fichiers sont bien uploadés :**
   - `public_html/build/manifest.json` doit exister
   - `public_html/build/assets/app-C50sj5x0.js` doit exister
   - `public_html/build/assets/app-DvJMKyRs.css` doit exister

### Méthode 2 : Via le Gestionnaire de Fichiers Hostinger

1. **Connectez-vous au panneau Hostinger**
   - Allez dans "Gestionnaire de fichiers" ou "File Manager"

2. **Naviguez vers `public_html/`**

3. **Créez le dossier `build/`** s'il n'existe pas :
   - Cliquez sur "Nouveau dossier"
   - Nommez-le `build`

4. **Uploadez les fichiers :**
   - Ouvrez le dossier `build/` que vous venez de créer
   - Cliquez sur "Uploader" ou "Upload"
   - Uploadez d'abord `manifest.json`
   - Créez un sous-dossier `assets/` dans `build/`
   - Uploadez les 3 fichiers dans `build/assets/` :
     - `app-C50sj5x0.js`
     - `app-DvJMKyRs.css`
     - `browser-ponyfill-oR2XOutU.js`

### Méthode 3 : Via SSH (si vous avez accès SSH)

```bash
# Connectez-vous en SSH à votre serveur Hostinger
ssh votre-utilisateur@aiais.org

# Naviguez vers le dossier public_html
cd /home/u507670352/domains/aiais.org/public_html

# Créez le dossier build s'il n'existe pas
mkdir -p build/assets

# Uploadez les fichiers (vous devrez utiliser scp depuis votre machine locale)
# Depuis votre ordinateur Windows, dans PowerShell :
```

Puis depuis votre ordinateur (PowerShell) :
```powershell
# Uploadez le dossier build complet
scp -r C:\Users\amine\Desktop\AIAIS\aiais\public\build\ votre-utilisateur@aiais.org:/home/u507670352/domains/aiais.org/public_html/
```

## 🔍 Vérification après upload

### 1. Vérifier que les fichiers existent

Accédez à ces URLs dans votre navigateur :

- ✅ `https://aiais.org/build/manifest.json`
  - **Doit afficher** : Le contenu JSON du manifest
  
- ✅ `https://aiais.org/build/assets/app-C50sj5x0.js`
  - **Doit afficher** : Le code JavaScript minifié (très long)

- ✅ `https://aiais.org/build/assets/app-DvJMKyRs.css`
  - **Doit afficher** : Le code CSS minifié

### 2. Si vous obtenez une erreur 404

- Vérifiez que les fichiers sont bien dans `public_html/build/` et non ailleurs
- Vérifiez les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)
- Vérifiez que le nom du dossier est bien `build` (en minuscules)

### 3. Vider le cache

Après avoir uploadé les fichiers, videz le cache :

**Sur le serveur (via SSH ou terminal Hostinger) :**
```bash
php artisan optimize:clear
```

**Dans votre navigateur :**
- Ctrl + Shift + Delete → Effacer le cache
- Ou navigation privée : Ctrl + Shift + N
- Ou hard refresh : Ctrl + F5

## 📋 Checklist de vérification

- [ ] Le dossier `public/build/` existe localement (✓ Vérifié)
- [ ] Le dossier `public_html/build/` existe sur Hostinger
- [ ] Le fichier `public_html/build/manifest.json` existe sur Hostinger
- [ ] Le dossier `public_html/build/assets/` existe sur Hostinger
- [ ] Les 3 fichiers dans `assets/` sont présents :
  - [ ] `app-C50sj5x0.js`
  - [ ] `app-DvJMKyRs.css`
  - [ ] `browser-ponyfill-oR2XOutU.js`
- [ ] Les permissions sont correctes (644 pour fichiers, 755 pour dossiers)
- [ ] Le cache Laravel a été vidé (`php artisan optimize:clear`)
- [ ] Le cache du navigateur a été vidé

## 🚀 Fichiers à uploader (chemin local)

**Dossier source sur votre ordinateur :**
```
C:\Users\amine\Desktop\AIAIS\aiais\public\build\
```

**Contenu à uploader :**
- `manifest.json` → `public_html/build/manifest.json`
- `assets/app-C50sj5x0.js` → `public_html/build/assets/app-C50sj5x0.js`
- `assets/app-DvJMKyRs.css` → `public_html/build/assets/app-DvJMKyRs.css`
- `assets/browser-ponyfill-oR2XOutU.js` → `public_html/build/assets/browser-ponyfill-oR2XOutU.js`

## ⚠️ Erreurs courantes

### Erreur : "404 Not Found" pour manifest.json
**Cause :** Le fichier n'est pas au bon endroit
**Solution :** Vérifiez que le chemin est exactement `public_html/build/manifest.json`

### Erreur : "Permission denied"
**Cause :** Permissions incorrectes
**Solution :** 
```bash
chmod 644 public_html/build/manifest.json
chmod 755 public_html/build
chmod 755 public_html/build/assets
chmod 644 public_html/build/assets/*
```

### Erreur : Le site fonctionne mais les styles ne s'appliquent pas
**Cause :** Le fichier CSS n'est pas uploadé
**Solution :** Vérifiez que `app-DvJMKyRs.css` est bien dans `public_html/build/assets/`

## 📞 Si le problème persiste

1. Vérifiez les logs Laravel : `storage/logs/laravel.log`
2. Vérifiez la console du navigateur (F12) pour d'autres erreurs
3. Vérifiez que tous les fichiers du dossier `public/` sont bien dans `public_html/`
