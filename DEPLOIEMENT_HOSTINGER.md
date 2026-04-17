# Guide de Déploiement sur Hostinger

## Problème : L'ancien projet s'affiche encore après l'upload

### Étapes de résolution

#### 1. **Compiler les assets React avant l'upload**

Avant d'uploader sur Hostinger, vous DEVEZ compiler les assets :

```bash
npm install
npm run build
```

Cela créera le dossier `public/build` avec tous les fichiers JavaScript et CSS compilés.

#### 2. **Vérifier la structure des fichiers sur Hostinger**

Sur Hostinger, la structure doit être :

```
public_html/
├── index.php          (depuis public/index.php)
├── .htaccess          (depuis public/.htaccess)
├── build/             (dossier créé par npm run build)
│   ├── assets/
│   │   ├── app-xxxxx.js
│   │   └── app-xxxxx.css
├── images/
├── documents/
├── locales/
├── video/
├── robots.txt
└── favicon.ico

domaine.com/
├── app/
├── bootstrap/
├── config/
├── database/
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env
├── composer.json
├── package.json
└── artisan
```

**IMPORTANT** : 
- Le contenu du dossier `public/` doit aller dans `public_html/`
- Tous les autres dossiers doivent être UN NIVEAU AU-DESSUS de `public_html/`

#### 3. **Vérifier le fichier .env**

Assurez-vous que votre `.env` sur Hostinger contient :

```env
APP_NAME="Association Initiative Al Amal"
APP_ENV=production
APP_KEY=base64:VOTRE_CLE_GENEREE
APP_DEBUG=false
APP_URL=https://aiais.org

# Base de données
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=votre_base_de_donnees
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

#### 4. **Nettoyer les caches**

Sur Hostinger, via SSH ou le gestionnaire de fichiers, exécutez :

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

Ou créez un fichier `clear-cache.php` dans `public_html/` :

```php
<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('config:clear');
$kernel->call('cache:clear');
$kernel->call('route:clear');
$kernel->call('view:clear');
echo "Caches cleared!";
```

Accédez à `https://aiais.org/clear-cache.php` puis supprimez ce fichier.

#### 5. **Vérifier le lien symbolique storage**

Sur Hostinger, créez le lien symbolique :

```bash
php artisan storage:link
```

Ou créez manuellement un lien symbolique de `public_html/storage` vers `../storage/app/public`

#### 6. **Vider le cache du navigateur**

- **Chrome/Edge** : Ctrl+Shift+Delete → Cochez "Images et fichiers en cache" → Effacer
- Ou ouvrez en navigation privée : Ctrl+Shift+N
- Ou faites un hard refresh : Ctrl+F5

#### 7. **Vérifier que les nouveaux fichiers sont bien uploadés**

Vérifiez les dates de modification des fichiers sur Hostinger pour confirmer qu'ils ont bien été remplacés.

#### 8. **Vérifier le fichier app.blade.php**

Le fichier `resources/views/app.blade.php` doit contenir :

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

#### 9. **Vérifier les permissions**

Sur Hostinger, les permissions doivent être :
- Dossiers : 755
- Fichiers : 644
- `storage/` et `bootstrap/cache/` : 775

#### 10. **Vérifier le fichier .htaccess**

Assurez-vous que `public_html/.htaccess` existe et contient bien les règles de réécriture.

### Checklist de déploiement

- [ ] `npm run build` exécuté localement
- [ ] Dossier `public/build` créé et uploadé
- [ ] Tous les fichiers du dossier `public/` sont dans `public_html/`
- [ ] Tous les autres dossiers sont au niveau parent de `public_html/`
- [ ] Fichier `.env` configuré correctement
- [ ] `APP_KEY` généré avec `php artisan key:generate`
- [ ] Base de données migrée : `php artisan migrate --force`
- [ ] Caches nettoyés
- [ ] Lien symbolique storage créé
- [ ] Permissions correctes
- [ ] Cache du navigateur vidé

### Si le problème persiste

1. **Vérifier les logs** : `storage/logs/laravel.log`
2. **Activer temporairement le debug** : Dans `.env`, mettre `APP_DEBUG=true` pour voir les erreurs
3. **Vérifier la console du navigateur** (F12) pour les erreurs JavaScript
4. **Vérifier que Vite est bien configuré** : Le fichier `public/build/.vite/manifest.json` doit exister

### Commandes importantes

```bash
# Compiler les assets
npm run build

# Générer la clé d'application
php artisan key:generate

# Nettoyer tous les caches
php artisan optimize:clear

# Créer le lien symbolique storage
php artisan storage:link

# Migrer la base de données
php artisan migrate --force
```
