# 🔄 Remplacer complètement le dossier build sur le serveur

## ❌ Problème identifié

Le `manifest.json` sur le serveur montre des fichiers différents de ceux compilés localement :

**Sur le serveur :**
- `app-DfwfKcJB.js`
- `app-BTTKXmdk.css`
- `browser-ponyfill-Cj8vaM2h.js`

**Localement (vos nouveaux fichiers) :**
- `app-BJ1UPcES.js`
- `app-BG_qhRTm.css`
- `browser-ponyfill-BTX890jA.js`

## ✅ Solution : Remplacer complètement le dossier build

### Étape 1 : Supprimer l'ancien dossier build sur le serveur

**Via SSH :**
```bash
cd /home/u507670352/domains/aiais.org/public_html
rm -rf build
```

**Via le Gestionnaire de Fichiers Hostinger :**
1. Allez dans `public_html/`
2. Supprimez complètement le dossier `build/`

### Étape 2 : Uploadez le nouveau dossier build complet

**Depuis votre ordinateur :**
- Dossier source : `C:\Users\amine\Desktop\AIAIS\aiais\public\build\`
- Destination : `public_html/build/` sur Hostinger

**Contenu à uploader :**
- `manifest.json`
- `assets/app-BJ1UPcES.js`
- `assets/app-BG_qhRTm.css`
- `assets/browser-ponyfill-BTX890jA.js`

### Étape 3 : Vérifier l'upload

Après l'upload, testez :

1. **`https://aiais.org/build/manifest.json`**
   - Doit afficher le JSON avec `app-BJ1UPcES.js` (nouveau nom)
   - Ne doit PAS afficher `app-DfwfKcJB.js` (ancien nom)

2. **`https://aiais.org/build/assets/app-BJ1UPcES.js`**
   - Doit afficher le code JavaScript
   - Si erreur 404 → Le fichier n'est pas uploadé

### Étape 4 : Vider les caches

**Sur le serveur :**
```bash
# Si artisan est accessible
php artisan optimize:clear

# Sinon, utilisez clear-all-cache.php
# (voir VIDER_CACHE_SERVEUR.md)
```

**Dans votre navigateur :**
- Videz le cache : `Ctrl + Shift + Delete`
- Ou testez en navigation privée : `Ctrl + Shift + N`

## 📋 Checklist de remplacement

- [ ] Ancien dossier `public_html/build/` supprimé sur le serveur
- [ ] Nouveau dossier `build/` uploadé depuis votre ordinateur
- [ ] `manifest.json` vérifié sur le serveur (doit montrer les nouveaux noms)
- [ ] Fichiers `assets/` vérifiés (doivent exister avec les nouveaux noms)
- [ ] Caches Laravel vidés
- [ ] Cache du navigateur vidé
- [ ] Testé en navigation privée

## ⚠️ Important

Assurez-vous de :
1. **Supprimer complètement** l'ancien dossier `build/` avant d'uploader le nouveau
2. **Uploadez le dossier complet** `build/` avec tous ses sous-dossiers
3. **Vérifiez les noms de fichiers** dans le manifest après l'upload

## 🔍 Vérification finale

Après avoir remplacé le dossier build, le manifest.json sur le serveur doit correspondre exactement à celui de votre ordinateur :

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

Si les noms correspondent, les nouveaux fichiers sont bien uploadés !
