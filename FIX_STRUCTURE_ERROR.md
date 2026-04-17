# 🔧 Correction de l'erreur de structure sur Hostinger

## ❌ Problème identifié

L'erreur montre que vous avez cette structure INCORRECTE sur Hostinger :

```
/home/u507670352/domains/aiais.org/public_html/
├── resources/              ← ⚠️ PROBLÈME : resources ne doit PAS être ici !
│   └── js/
│       └── components/
│           └── ScrollToTop.jsx
├── node_modules/          ← ⚠️ PROBLÈME : node_modules ne doit PAS être ici !
├── package.json           ← ⚠️ PROBLÈME : package.json ne doit PAS être ici !
├── index.php
├── .htaccess
└── build/
```

## ✅ Structure CORRECTE sur Hostinger

```
/home/u507670352/domains/aiais.org/
├── public_html/                    ← Dossier web racine
│   ├── build/                     ← Assets compilés
│   │   ├── manifest.json
│   │   └── assets/
│   ├── index.php
│   ├── .htaccess
│   ├── images/
│   ├── documents/
│   ├── locales/
│   └── robots.txt
│
├── app/                            ← Niveau parent de public_html
├── bootstrap/
├── config/
├── database/
├── resources/                      ← ✅ ICI, pas dans public_html !
│   ├── js/
│   ├── css/
│   └── views/
├── routes/
├── storage/
├── vendor/
├── .env
├── composer.json
├── package.json                    ← ✅ ICI, pas dans public_html !
└── artisan
```

## 🔧 Solution : Réorganiser la structure

### Étape 1 : Vérifier la structure actuelle

Connectez-vous en SSH et vérifiez :

```bash
cd /home/u507670352/domains/aiais.org
ls -la public_html/
```

Si vous voyez `resources/`, `node_modules/`, ou `package.json` dans `public_html/`, c'est le problème.

### Étape 2 : Déplacer les fichiers au bon endroit

**Option A : Via SSH (recommandé)**

```bash
# Connectez-vous en SSH
cd /home/u507670352/domains/aiais.org

# Vérifiez ce qui est dans public_html
ls -la public_html/

# Si resources/ est dans public_html/, déplacez-le
if [ -d "public_html/resources" ]; then
    mv public_html/resources .
    echo "resources/ déplacé"
fi

# Si node_modules/ est dans public_html/, déplacez-le
if [ -d "public_html/node_modules" ]; then
    mv public_html/node_modules .
    echo "node_modules/ déplacé"
fi

# Si package.json est dans public_html/, déplacez-le
if [ -f "public_html/package.json" ]; then
    mv public_html/package.json .
    echo "package.json déplacé"
fi

# Si composer.json est dans public_html/, déplacez-le
if [ -f "public_html/composer.json" ]; then
    mv public_html/composer.json .
    echo "composer.json déplacé"
fi

# Vérifiez la structure finale
echo "=== Structure dans public_html/ ==="
ls -la public_html/ | grep -E "(resources|node_modules|package.json|composer.json)"

echo "=== Structure au niveau parent ==="
ls -la | grep -E "(resources|node_modules|package.json|composer.json)"
```

**Option B : Via le Gestionnaire de Fichiers Hostinger**

1. **Ouvrez le panneau Hostinger**
2. **Allez dans "Gestionnaire de Fichiers"**
3. **Naviguez vers `public_html/`**
4. **Si vous voyez ces dossiers/fichiers dans `public_html/`, déplacez-les :**
   - `resources/` → Déplacez vers le niveau parent (domaine.com/)
   - `node_modules/` → Déplacez vers le niveau parent
   - `package.json` → Déplacez vers le niveau parent
   - `composer.json` → Déplacez vers le niveau parent
   - `app/`, `bootstrap/`, `config/`, etc. → Déplacez vers le niveau parent

### Étape 3 : Vérifier que seul le contenu de `public/` est dans `public_html/`

Dans `public_html/`, vous devriez avoir UNIQUEMENT :

```
public_html/
├── build/              ← Assets compilés (depuis public/build/)
├── index.php           ← Depuis public/index.php
├── .htaccess          ← Depuis public/.htaccess
├── images/            ← Depuis public/images/
├── documents/         ← Depuis public/documents/
├── locales/           ← Depuis public/locales/
├── video/             ← Depuis public/video/ (si existe)
├── robots.txt         ← Depuis public/robots.txt
└── favicon.ico        ← Depuis public/favicon.ico
```

**NE DOIT PAS être dans public_html/ :**
- ❌ `resources/`
- ❌ `node_modules/`
- ❌ `package.json`
- ❌ `composer.json`
- ❌ `app/`
- ❌ `bootstrap/`
- ❌ `config/`
- ❌ `database/`
- ❌ `routes/`
- ❌ `storage/`
- ❌ `vendor/`
- ❌ `.env`
- ❌ `artisan`

### Étape 4 : Compiler localement (RECOMMANDÉ)

**NE compilez PAS sur le serveur.** Compilez localement et uploadez seulement le dossier `build/` :

1. **Sur votre ordinateur :**
   ```powershell
   cd C:\Users\amine\Desktop\AIAIS\aiais
   npm run build
   ```

2. **Uploadez uniquement le dossier `public/build/`** sur Hostinger dans `public_html/build/`

3. **C'est tout !** Pas besoin de compiler sur le serveur.

## 🔍 Vérification après correction

### Vérifier la structure

```bash
cd /home/u507670352/domains/aiais.org

# Vérifier que resources/ est au bon endroit
ls -la resources/  # Doit exister au niveau parent

# Vérifier que resources/ n'est PAS dans public_html/
ls -la public_html/resources/  # Doit donner "No such file or directory"

# Vérifier que public_html/ contient seulement les fichiers publics
ls -la public_html/
# Doit montrer : build/, index.php, .htaccess, images/, etc.
# Ne doit PAS montrer : resources/, node_modules/, package.json
```

### Vérifier que le site fonctionne

1. **Testez** : `https://aiais.org/build/manifest.json`
   - Doit afficher le JSON du manifest

2. **Videz le cache Laravel :**
   ```bash
   php artisan optimize:clear
   ```

3. **Videz le cache du navigateur** (Ctrl + Shift + Delete)

## ⚠️ Pourquoi cette erreur s'est produite

L'erreur `[vite:esbuild] The service was stopped` s'est produite parce que :

1. **Structure incorrecte** : Les fichiers sources (`resources/`) sont dans `public_html/` au lieu d'être au niveau parent
2. **Vite ne peut pas compiler** : Vite cherche les fichiers dans `resources/` au niveau parent, mais ils sont dans `public_html/resources/`
3. **Problème de mémoire** : esbuild peut avoir manqué de mémoire en essayant de compiler depuis le mauvais emplacement

## ✅ Solution finale recommandée

**NE compilez JAMAIS sur le serveur.** Voici le workflow correct :

1. **Développez et testez localement**
2. **Compilez localement** : `npm run build`
3. **Uploadez uniquement** le dossier `public/build/` sur Hostinger
4. **Assurez-vous** que la structure est correcte (resources/ au niveau parent)

C'est plus simple, plus rapide, et évite ce genre de problèmes !
