# Guide d'Upload sur Hostinger - Étapes Détaillées

## ✅ Étape 1 : Vérification locale (FAIT)

Les assets sont compilés avec succès :
- ✓ `public/build/manifest.json`
- ✓ `public/build/assets/app-C50sj5x0.js` (962.83 kB)
- ✓ `public/build/assets/app-DvJMKyRs.css` (113.83 kB)
- ✓ `public/build/assets/browser-ponyfill-oR2XOutU.js` (10.29 kB)

## 📤 Étape 2 : Upload sur Hostinger

### Structure à respecter sur Hostinger :

```
public_html/                          ← Dossier racine web
├── build/                            ← ⚠️ CRITIQUE : Tout le contenu de public/build/
│   ├── manifest.json
│   └── assets/
│       ├── app-C50sj5x0.js
│       ├── app-DvJMKyRs.css
│       └── browser-ponyfill-oR2XOutU.js
├── index.php                         ← Depuis public/index.php
├── .htaccess                         ← Depuis public/.htaccess
├── images/                           ← Depuis public/images/
├── documents/                        ← Depuis public/documents/
├── locales/                          ← Depuis public/locales/
├── video/                            ← Depuis public/video/
├── robots.txt                        ← Depuis public/robots.txt
└── favicon.ico                       ← Depuis public/favicon.ico

domaine.com/                          ← Niveau parent (hors public_html)
├── app/
├── bootstrap/
├── config/
├── database/
├── resources/
├── routes/
├── storage/
├── vendor/                           ← Après composer install
├── .env                              ← À créer/configurer
├── composer.json
├── package.json
└── artisan
```

### Instructions d'upload :

1. **Via FTP/SFTP (FileZilla, WinSCP, etc.) :**
   - Connectez-vous à votre compte Hostinger
   - Naviguez vers `public_html/`
   - **Uploadez TOUT le contenu du dossier `public/`** dans `public_html/`
   - ⚠️ **IMPORTANT** : Assurez-vous que le dossier `build/` est bien présent dans `public_html/build/`

2. **Via le Gestionnaire de Fichiers Hostinger :**
   - Allez dans le panneau Hostinger
   - Ouvrez "Gestionnaire de fichiers"
   - Naviguez vers `public_html/`
   - Uploadez tous les fichiers du dossier `public/` local

## 🔧 Étape 3 : Configuration sur le serveur

### 3.1 Installer les dépendances PHP

Via SSH ou le terminal Hostinger :

```bash
cd /home/votre-compte/domaine.com
composer install --no-dev --optimize-autoloader
```

### 3.2 Configurer le fichier .env

Créez/modifiez le fichier `.env` au niveau parent de `public_html/` :

```env
APP_NAME="Association Initiative Al Amal"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://aiais.org

APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=votre_base_de_donnees
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
```

### 3.3 Générer la clé d'application

```bash
php artisan key:generate
```

### 3.4 Migrer la base de données

```bash
php artisan migrate --force
```

### 3.5 Créer le lien symbolique storage

```bash
php artisan storage:link
```

### 3.6 Nettoyer tous les caches

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3.7 Vérifier les permissions

```bash
chmod -R 755 storage bootstrap/cache
chmod -R 644 .env
```

## 🔍 Étape 4 : Vérifications

### Vérifier que les fichiers sont bien uploadés :

1. **Vérifier le dossier build :**
   - Accédez à : `https://aiais.org/build/manifest.json`
   - Vous devriez voir le contenu JSON du manifest

2. **Vérifier les assets :**
   - Accédez à : `https://aiais.org/build/assets/app-C50sj5x0.js`
   - Vous devriez voir le code JavaScript minifié

3. **Vérifier le fichier index.php :**
   - Accédez à : `https://aiais.org/`
   - Le site devrait se charger

### Si le site ne se charge toujours pas :

1. **Vider le cache du navigateur :**
   - Chrome/Edge : `Ctrl + Shift + Delete`
   - Ou navigation privée : `Ctrl + Shift + N`
   - Ou hard refresh : `Ctrl + F5`

2. **Vérifier les logs d'erreur :**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Activer temporairement le debug :**
   Dans `.env`, changez :
   ```env
   APP_DEBUG=true
   ```
   Cela affichera les erreurs détaillées (à désactiver après résolution)

4. **Vérifier la console du navigateur :**
   - Appuyez sur `F12`
   - Onglet "Console" pour voir les erreurs JavaScript
   - Onglet "Network" pour voir si les fichiers sont chargés

## ⚠️ Problèmes courants

### Problème : "404 Not Found" pour les assets
**Solution :** Vérifiez que le dossier `build/` est bien dans `public_html/build/` et non ailleurs

### Problème : Page blanche
**Solution :** 
- Vérifiez `storage/logs/laravel.log`
- Vérifiez que `APP_KEY` est défini dans `.env`
- Vérifiez les permissions des dossiers `storage/` et `bootstrap/cache/`

### Problème : Ancien site toujours visible
**Solution :**
- Videz le cache du navigateur
- Vérifiez que les nouveaux fichiers ont bien remplacé les anciens
- Vérifiez les dates de modification des fichiers sur le serveur
- Exécutez `php artisan optimize:clear` sur le serveur

### Problème : Erreur "Vite manifest not found"
**Solution :** 
- Vérifiez que `public_html/build/manifest.json` existe
- Vérifiez les permissions du fichier (644)

## 📋 Checklist finale

- [ ] Dossier `public/build/` uploadé dans `public_html/build/`
- [ ] Tous les fichiers de `public/` sont dans `public_html/`
- [ ] Tous les autres dossiers sont au niveau parent de `public_html/`
- [ ] `composer install` exécuté sur le serveur
- [ ] Fichier `.env` créé et configuré
- [ ] `php artisan key:generate` exécuté
- [ ] `php artisan migrate --force` exécuté
- [ ] `php artisan storage:link` exécuté
- [ ] `php artisan optimize:clear` exécuté
- [ ] Permissions correctes (755 pour dossiers, 644 pour fichiers)
- [ ] Cache du navigateur vidé
- [ ] Site testé en navigation privée

## 🆘 Support

Si le problème persiste après avoir suivi toutes ces étapes :
1. Vérifiez les logs : `storage/logs/laravel.log`
2. Vérifiez la console du navigateur (F12)
3. Contactez le support Hostinger avec les détails de l'erreur
