# 🔧 Solution : Erreur de compilation sur le serveur

## ❌ Problème actuel

Vous essayez de compiler sur le serveur, mais :
1. La structure est incorrecte (`resources/` dans `public_html/`)
2. Le serveur manque peut-être de mémoire
3. C'est plus lent et plus complexe

## ✅ Solution : Compiler localement (RECOMMANDÉ)

### Étape 1 : Compiler sur votre ordinateur

```powershell
cd C:\Users\amine\Desktop\AIAIS\aiais
npm run build
```

Cela créera le dossier `public/build/` avec tous les fichiers compilés.

### Étape 2 : Uploader uniquement le dossier `build/`

**Sur Hostinger, vous devez uploader :**
- Le dossier `public/build/` → dans `public_html/build/`

**Vous NE devez PAS uploader :**
- ❌ `resources/`
- ❌ `node_modules/`
- ❌ `package.json`
- ❌ Les fichiers sources `.jsx`

### Étape 3 : Vérifier

Après l'upload, testez :
```
https://aiais.org/build/manifest.json
```

Si vous voyez le JSON, c'est bon !

## ⚠️ Si vous voulez quand même compiler sur le serveur

### 1. Corriger la structure d'abord

```bash
cd /home/u507670352/domains/aiais.org

# Vérifier où est resources/
ls -la public_html/resources/

# Si resources/ est dans public_html/, le déplacer
if [ -d "public_html/resources" ]; then
    mv public_html/resources .
    echo "resources/ déplacé"
fi

# Vérifier la structure
ls -la | grep resources
# Doit afficher: resources/ (au niveau parent)
```

### 2. Compiler depuis le bon endroit

```bash
# Aller au niveau parent (pas dans public_html)
cd /home/u507670352/domains/aiais.org

# Installer les dépendances si nécessaire
npm install --production=false

# Compiler
npm run build

# Vérifier que build/ a été créé dans public/
ls -la public/build/
```

### 3. Copier le dossier build vers public_html

```bash
# Copier le dossier build vers public_html
cp -r public/build public_html/

# Vérifier
ls -la public_html/build/
```

## 🎯 Recommandation finale

**Compilez TOUJOURS localement** :
1. Plus rapide
2. Plus simple
3. Pas de problème de mémoire serveur
4. Pas besoin de Node.js sur le serveur

**Workflow recommandé :**
1. Modifier le code localement
2. Tester avec `npm run dev`
3. Compiler avec `npm run build`
4. Uploadez uniquement `public/build/` sur le serveur
5. Vider le cache : `php artisan optimize:clear`
