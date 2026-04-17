# 🔍 Vérification : Les nouveaux fichiers sont-ils bien uploadés ?

## Fichiers compilés localement (NOUVEAUX)

Après `npm run build`, vous devriez avoir ces fichiers :

```
public/build/manifest.json
public/build/assets/app-BJ1UPcES.js
public/build/assets/app-BG_qhRTm.css
public/build/assets/browser-ponyfill-BTX890jA.js
```

## Vérification sur le serveur

### Test 1 : Vérifier le manifest.json

Accédez à : `https://aiais.org/build/manifest.json`

**Vous devriez voir :**
```json
{
  "resources/js/app.jsx": {
    "file": "assets/app-BJ1UPcES.js",
    ...
  },
  "resources/css/app.css": {
    "file": "assets/app-BG_qhRTm.css",
    ...
  }
}
```

**Si vous voyez d'anciens noms de fichiers** (comme `app-C50sj5x0.js`), alors les anciens fichiers sont encore là.

### Test 2 : Vérifier les fichiers assets

Testez ces URLs :

1. `https://aiais.org/build/assets/app-BJ1UPcES.js`
   - ✅ Doit afficher le code JavaScript (très long)
   - ❌ Si erreur 404 → Le fichier n'est pas uploadé

2. `https://aiais.org/build/assets/app-BG_qhRTm.css`
   - ✅ Doit afficher le code CSS
   - ❌ Si erreur 404 → Le fichier n'est pas uploadé

### Test 3 : Vérifier via la console du navigateur

1. Ouvrez `https://aiais.org`
2. Appuyez sur `F12` (outils de développement)
3. Onglet "Network"
4. Rechargez la page (`F5`)
5. Cherchez les requêtes vers `/build/assets/`
6. Vérifiez les noms de fichiers chargés

**Si vous voyez :**
- `app-BJ1UPcES.js` → ✅ Nouveaux fichiers chargés
- `app-C50sj5x0.js` → ❌ Anciens fichiers encore en cache

## Solution si les anciens fichiers sont encore là

### Option A : Supprimer et ré-uploader

1. **Sur Hostinger, supprimez complètement le dossier build :**
   ```bash
   rm -rf public_html/build
   ```

2. **Uploadez à nouveau le dossier `build/` complet**

3. **Videz les caches :**
   ```bash
   php artisan optimize:clear
   ```

### Option B : Vérifier qu'il n'y a pas de doublons

Vérifiez qu'il n'y a pas :
```
public_html/build/build/     ← ❌ Ne doit PAS exister
```

Si cela existe, supprimez-le et gardez seulement `public_html/build/`

## Commandes de vérification sur le serveur

```bash
cd /home/u507670352/domains/aiais.org/public_html/build

# Vérifier le contenu
ls -la

# Vérifier les assets
ls -la assets/

# Vérifier le manifest
cat manifest.json

# Vérifier les dates (doivent être récentes)
stat manifest.json
stat assets/app-BJ1UPcES.js
```
