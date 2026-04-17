# 🔧 Résoudre le problème de cache - Ancien projet toujours visible

## ❌ Problème
Vous avez compilé localement, uploadé le dossier `build/`, mais l'ancien projet s'affiche encore.

## ✅ Solutions par ordre de priorité

### Solution 1 : Vider TOUS les caches (IMPORTANT)

#### Sur le serveur Hostinger (via SSH ou terminal) :

```bash
cd /home/u507670352/domains/aiais.org

# Vider tous les caches Laravel
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Si vous avez OPcache activé, redémarrer PHP
# (contactez le support Hostinger si nécessaire)
```

#### Dans votre navigateur :

1. **Vider le cache complètement :**
   - Chrome/Edge : `Ctrl + Shift + Delete`
   - Cochez "Images et fichiers en cache"
   - Sélectionnez "Tout le temps"
   - Cliquez sur "Effacer les données"

2. **Ou utiliser la navigation privée :**
   - `Ctrl + Shift + N` (Chrome/Edge)
   - Testez le site en navigation privée

3. **Ou faire un hard refresh :**
   - `Ctrl + F5` (Windows)
   - `Ctrl + Shift + R` (alternative)

### Solution 2 : Vérifier que les fichiers ont bien été remplacés

#### Vérifier les dates de modification sur Hostinger :

```bash
# Via SSH
cd /home/u507670352/domains/aiais.org/public_html/build

# Vérifier les dates des fichiers
ls -la assets/
```

Les dates doivent être **récentes** (aujourd'hui ou hier).

#### Vérifier le contenu du manifest.json :

Accédez à : `https://aiais.org/build/manifest.json`

Comparez avec votre fichier local `public/build/manifest.json`. Les noms de fichiers doivent correspondre.

### Solution 3 : Vérifier que les fichiers sont au bon endroit

Sur Hostinger, la structure doit être :

```
public_html/
├── build/
│   ├── manifest.json          ← Doit exister
│   └── assets/
│       ├── app-xxxxx.js       ← Doit exister (nom peut varier)
│       └── app-xxxxx.css      ← Doit exister (nom peut varier)
```

**Vérifiez que vous n'avez PAS :**
```
public_html/build/build/       ← ❌ Ne doit PAS exister
```

### Solution 4 : Forcer le rechargement avec un paramètre de version

Si le problème persiste, vous pouvez ajouter un paramètre de version dans `app.blade.php` :

```blade
@vite(['resources/css/app.css', 'resources/js/app.jsx'], 'build')
```

Mais normalement, Vite gère cela automatiquement via le manifest.

### Solution 5 : Vérifier les permissions des fichiers

Sur Hostinger :

```bash
cd /home/u507670352/domains/aiais.org/public_html/build

# Vérifier les permissions
ls -la

# Corriger si nécessaire
chmod 644 manifest.json
chmod 644 assets/*
chmod 755 assets/
chmod 755 .
```

### Solution 6 : Vérifier le fichier .env

Assurez-vous que dans `.env` sur Hostinger :

```env
APP_ENV=production
APP_DEBUG=false
```

Et après modification, videz le cache :

```bash
php artisan config:clear
php artisan config:cache
```

## 🔍 Diagnostic étape par étape

### Étape 1 : Vérifier que les nouveaux fichiers sont sur le serveur

**Test 1 :** Accédez à `https://aiais.org/build/manifest.json`
- ✅ Si vous voyez le JSON → Les fichiers sont uploadés
- ❌ Si erreur 404 → Les fichiers ne sont pas au bon endroit

**Test 2 :** Regardez le contenu du manifest.json
- Notez les noms des fichiers (ex: `app-C50sj5x0.js`)
- Testez : `https://aiais.org/build/assets/app-C50sj5x0.js`
- ✅ Si vous voyez le code JavaScript → Les fichiers sont bien là
- ❌ Si erreur 404 → Problème de chemin

### Étape 2 : Vérifier le cache du navigateur

1. Ouvrez les outils de développement (F12)
2. Onglet "Network"
3. Cochez "Disable cache"
4. Rechargez la page (F5)
5. Regardez les requêtes vers `/build/assets/`
   - Vérifiez que les fichiers chargés ont les bons noms (ceux du nouveau manifest)

### Étape 3 : Vérifier le cache Laravel

```bash
# Sur le serveur
php artisan optimize:clear

# Vérifier que les caches sont bien vidés
ls -la bootstrap/cache/
# Ne doit contenir que .gitignore (ou être vide)
```

## 🎯 Solution rapide (à faire dans l'ordre)

1. **Sur le serveur :**
   ```bash
   php artisan optimize:clear
   ```

2. **Dans votre navigateur :**
   - Ouvrez en navigation privée : `Ctrl + Shift + N`
   - Ou videz le cache : `Ctrl + Shift + Delete`

3. **Vérifiez :**
   - Accédez à `https://aiais.org/build/manifest.json`
   - Comparez avec votre fichier local

4. **Si ça ne marche toujours pas :**
   - Vérifiez les dates de modification des fichiers sur le serveur
   - Vérifiez que les fichiers dans `public_html/build/assets/` sont bien les nouveaux

## ⚠️ Problèmes courants

### Problème : Les fichiers sont uploadés mais l'ancien manifest est utilisé

**Cause :** Cache Laravel ou navigateur

**Solution :**
```bash
php artisan optimize:clear
# Puis vider le cache du navigateur
```

### Problème : Les noms de fichiers ont changé mais l'ancien est toujours chargé

**Cause :** Cache du navigateur qui garde l'ancien manifest

**Solution :**
- Vider complètement le cache du navigateur
- Ou utiliser la navigation privée

### Problème : Les modifications ne s'affichent pas même après avoir vidé le cache

**Cause :** Les fichiers n'ont pas été correctement remplacés sur le serveur

**Solution :**
1. Supprimez complètement `public_html/build/` sur le serveur
2. Uploadez à nouveau le dossier `build/` complet
3. Videz les caches

## 📋 Checklist de vérification

- [ ] `npm run build` exécuté localement avec succès
- [ ] Dossier `public/build/` créé localement
- [ ] Dossier `public_html/build/` existe sur Hostinger
- [ ] `public_html/build/manifest.json` existe et est récent
- [ ] `public_html/build/assets/` contient les nouveaux fichiers
- [ ] Les dates de modification sont récentes
- [ ] `php artisan optimize:clear` exécuté sur le serveur
- [ ] Cache du navigateur vidé
- [ ] Testé en navigation privée
- [ ] Les noms de fichiers dans le manifest correspondent aux fichiers uploadés

## 🚀 Commande complète de nettoyage

Sur le serveur Hostinger :

```bash
cd /home/u507670352/domains/aiais.org

# Vider tous les caches
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Vérifier la structure
ls -la public_html/build/
ls -la public_html/build/assets/

# Vérifier les permissions
chmod -R 755 public_html/build
chmod -R 644 public_html/build/assets/*
```

Ensuite, dans votre navigateur :
- Videz le cache : `Ctrl + Shift + Delete`
- Ou testez en navigation privée : `Ctrl + Shift + N`
