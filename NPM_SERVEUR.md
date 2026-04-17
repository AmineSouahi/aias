# 📦 npm run dev vs npm run build sur le serveur

## ❌ `npm run dev` - NE PAS utiliser sur le serveur

**`npm run dev`** est **UNIQUEMENT pour le développement local**.

### Ce que fait `npm run dev` :
- Lance un serveur Vite en mode développement
- Surveille les changements de fichiers (hot reload)
- Génère des fichiers NON minifiés
- Nécessite que le processus reste actif en permanence
- Utilise beaucoup de ressources serveur

### ⚠️ Pourquoi NE PAS l'utiliser en production :
- Le processus doit tourner en permanence (consomme des ressources)
- Les fichiers ne sont pas optimisés pour la production
- Pas de minification ni d'optimisation
- Risque de sécurité (expose des informations de debug)

## ✅ `npm run build` - À utiliser (mais de préférence localement)

**`npm run build`** compile les assets pour la production.

### Ce que fait `npm run build` :
- Compile et minifie tous les fichiers JavaScript et CSS
- Optimise les assets pour la production
- Crée le dossier `public/build/` avec les fichiers compilés
- Génère le fichier `manifest.json` nécessaire pour Laravel

## 🎯 Deux approches possibles

### Approche 1 : Compiler localement (RECOMMANDÉ) ⭐

**Avantages :**
- Plus rapide (pas besoin de Node.js sur le serveur)
- Moins de ressources serveur utilisées
- Plus simple et plus sûr

**Étapes :**

1. **Sur votre ordinateur local :**
   ```bash
   npm install
   npm run build
   ```

2. **Uploadez le dossier `public/build/`** sur Hostinger dans `public_html/build/`

3. **C'est tout !** Pas besoin de Node.js sur le serveur.

### Approche 2 : Compiler directement sur le serveur

**Quand utiliser cette approche :**
- Si vous avez accès SSH sur Hostinger
- Si Node.js et npm sont installés sur le serveur
- Si vous préférez compiler directement sur le serveur

**Étapes :**

1. **Connectez-vous en SSH à votre serveur Hostinger**

2. **Naviguez vers le dossier de votre projet :**
   ```bash
   cd /home/u507670352/domains/aiais.org
   ```

3. **Installez les dépendances npm (si pas déjà fait) :**
   ```bash
   npm install --production=false
   ```
   Note: `--production=false` est nécessaire car certaines dépendances de développement sont nécessaires pour compiler.

4. **Compilez les assets :**
   ```bash
   npm run build
   ```

5. **Vérifiez que le dossier build a été créé :**
   ```bash
   ls -la public_html/build/
   ```
   Vous devriez voir : `manifest.json` et le dossier `assets/`

6. **Videz le cache Laravel :**
   ```bash
   php artisan optimize:clear
   ```

## 🔍 Vérifier si Node.js est installé sur Hostinger

Connectez-vous en SSH et exécutez :

```bash
node --version
npm --version
```

- Si vous voyez des numéros de version → Node.js est installé ✅
- Si vous voyez "command not found" → Node.js n'est pas installé ❌

### Si Node.js n'est pas installé sur Hostinger

Vous avez deux options :

1. **Installer Node.js sur Hostinger** (si l'hébergement le permet)
   - Contactez le support Hostinger pour savoir comment installer Node.js
   - Ou utilisez un gestionnaire de versions comme `nvm`

2. **Compiler localement** (plus simple) ⭐
   - Compilez sur votre ordinateur avec `npm run build`
   - Uploadez le dossier `public/build/` sur le serveur

## 📋 Comparaison des approches

| Critère | Compiler localement | Compiler sur serveur |
|---------|---------------------|----------------------|
| **Simplicité** | ⭐⭐⭐⭐⭐ Très simple | ⭐⭐⭐ Nécessite SSH et Node.js |
| **Vitesse** | ⭐⭐⭐⭐⭐ Rapide | ⭐⭐⭐ Dépend de la connexion SSH |
| **Ressources serveur** | ⭐⭐⭐⭐⭐ Aucune | ⭐⭐⭐ Utilise CPU/RAM |
| **Recommandé pour** | Tous les cas | Si vous avez déjà Node.js installé |

## ✅ Recommandation finale

**Pour votre cas, je recommande fortement de compiler localement :**

1. Sur votre ordinateur :
   ```powershell
   cd C:\Users\amine\Desktop\AIAIS\aiais
   npm run build
   ```

2. Uploadez le dossier `public/build/` sur Hostinger dans `public_html/build/`

3. Videz le cache :
   ```bash
   php artisan optimize:clear
   ```

C'est plus simple, plus rapide, et ne nécessite pas Node.js sur le serveur !

## ⚠️ Important : Ne JAMAIS utiliser `npm run dev` sur le serveur

- `npm run dev` = développement local uniquement
- `npm run build` = production (localement ou sur serveur)

## 🔄 Workflow recommandé pour les mises à jour futures

1. **Modifiez votre code localement**
2. **Testez en local** avec `npm run dev`
3. **Compilez pour la production** : `npm run build`
4. **Uploadez uniquement le dossier `public/build/`** sur le serveur
5. **Videz le cache** : `php artisan optimize:clear`
