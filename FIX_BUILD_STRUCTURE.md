# 🔧 Correction de la structure du dossier build

## ❌ Problème identifié

Vous avez actuellement cette structure sur Hostinger :
```
public_html/build/
  ├── build/              ← ⚠️ PROBLÈME : Dossier build dans build !
  │   └── (contenu ici)
  ├── .htaccess
  ├── favicon.ico
  ├── index.php
  └── robots.txt
```

Mais Laravel cherche les fichiers ici :
```
public_html/build/
  ├── manifest.json        ← Laravel cherche ici
  ├── assets/
  │   ├── app-C50sj5x0.js
  │   ├── app-DvJMKyRs.css
  │   └── browser-ponyfill-oR2XOutU.js
```

## ✅ Solution : Déplacer le contenu

Vous devez déplacer le contenu de `public_html/build/build/` vers `public_html/build/`

### Méthode 1 : Via le Gestionnaire de Fichiers Hostinger

1. **Ouvrez le dossier `public_html/build/build/`**
   - Vous devriez voir : `manifest.json` et le dossier `assets/`

2. **Sélectionnez TOUS les fichiers et dossiers** dans `build/build/` :
   - `manifest.json`
   - `assets/` (dossier)

3. **Coupez-les** (Cut) ou **Copiez-les** (Copy)

4. **Remontez d'un niveau** vers `public_html/build/`

5. **Collez les fichiers** directement dans `public_html/build/`

6. **Supprimez le dossier vide `build/build/`** (maintenant vide)

### Méthode 2 : Via SSH (si vous avez accès)

```bash
# Connectez-vous en SSH
ssh votre-utilisateur@aiais.org

# Naviguez vers le dossier
cd /home/u507670352/domains/aiais.org/public_html/build

# Déplacez le contenu de build/build/ vers build/
mv build/* .
mv build/assets/* assets/ 2>/dev/null || true

# Supprimez le dossier build vide
rmdir build

# Vérifiez la structure
ls -la
# Vous devriez voir : manifest.json et assets/
```

### Méthode 3 : Supprimer et ré-uploader

1. **Supprimez le dossier `public_html/build/build/`**

2. **Vérifiez que `public_html/build/` contient directement :**
   - `manifest.json`
   - `assets/` (dossier avec les 3 fichiers JS/CSS)

3. Si ce n'est pas le cas, **uploadez directement** le contenu de votre dossier local `public/build/` dans `public_html/build/`

## ✅ Structure correcte finale

Après correction, vous devriez avoir :

```
public_html/build/
  ├── manifest.json          ← Doit être ici directement
  └── assets/
      ├── app-C50sj5x0.js
      ├── app-DvJMKyRs.css
      └── browser-ponyfill-oR2XOutU.js
```

**ET PAS :**
```
public_html/build/build/     ← ❌ Ne doit PAS exister
```

## 🔍 Vérification

Après avoir corrigé la structure, testez ces URLs :

1. **`https://aiais.org/build/manifest.json`**
   - ✅ Doit afficher le JSON du manifest
   - ❌ Si erreur 404, le fichier n'est toujours pas au bon endroit

2. **`https://aiais.org/build/assets/app-C50sj5x0.js`**
   - ✅ Doit afficher le code JavaScript
   - ❌ Si erreur 404, vérifiez le dossier assets/

## 📋 Checklist de correction

- [ ] Ouvrir `public_html/build/build/` et voir son contenu
- [ ] Déplacer `manifest.json` de `build/build/` vers `build/`
- [ ] Déplacer le dossier `assets/` de `build/build/` vers `build/`
- [ ] Supprimer le dossier vide `build/build/`
- [ ] Vérifier que `public_html/build/manifest.json` existe directement
- [ ] Vérifier que `public_html/build/assets/` existe directement
- [ ] Tester `https://aiais.org/build/manifest.json`
- [ ] Vider le cache : `php artisan optimize:clear`
- [ ] Vider le cache du navigateur

## ⚠️ Note importante

Les fichiers `.htaccess`, `index.php`, `favicon.ico`, et `robots.txt` doivent rester dans `public_html/` (pas dans `build/`).

La structure complète correcte est :
```
public_html/
  ├── build/              ← Dossier build avec manifest.json et assets/
  │   ├── manifest.json
  │   └── assets/
  ├── .htaccess
  ├── index.php
  ├── favicon.ico
  └── robots.txt
```
