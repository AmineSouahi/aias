# Résolution du conflit Git sur le serveur

## Situation
Vous avez des modifications locales sur le serveur qui entrent en conflit avec les changements du dépôt GitHub.

## Option 1 : Sauvegarder les changements locaux (Stash) - RECOMMANDÉ

Cette option sauvegarde vos modifications locales, récupère les changements distants, puis réapplique vos modifications.

```bash
# 1. Sauvegarder les modifications locales
git stash save "Modifications locales avant pull"

# 2. Récupérer les changements de GitHub
git pull origin main

# 3. Réappliquer vos modifications locales
git stash pop

# 4. Si des conflits apparaissent, résolvez-les manuellement
# Puis commitez :
git add .
git commit -m "Merge des modifications locales avec les changements distants"
```

## Option 2 : Commiter les changements locaux puis merger

Si vous voulez garder un historique de vos modifications locales :

```bash
# 1. Commiter les modifications locales
git add .
git commit -m "Modifications locales sur le serveur"

# 2. Récupérer et merger les changements distants
git pull origin main

# 3. Si des conflits apparaissent, résolvez-les
# Git vous indiquera les fichiers en conflit
# Éditez les fichiers pour résoudre les conflits
# Puis :
git add .
git commit -m "Résolution des conflits de merge"
```

## Option 3 : Écraser les changements locaux (ATTENTION)

⚠️ **Utilisez cette option uniquement si vos modifications locales ne sont pas importantes**

```bash
# 1. Annuler toutes les modifications locales
git reset --hard HEAD

# 2. Récupérer les changements distants
git pull origin main
```

## Option 4 : Voir les différences avant de décider

Pour voir ce qui diffère entre vos modifications locales et les changements distants :

```bash
# Voir les différences pour un fichier spécifique
git diff app/Http/Controllers/Api/SupportProjectController.php

# Voir toutes les différences
git diff

# Voir les différences avec le dépôt distant
git fetch origin
git diff HEAD origin/main
```

## Résolution manuelle des conflits

Si vous choisissez l'option 1 ou 2 et que des conflits apparaissent :

1. **Git marquera les conflits dans les fichiers** avec des marqueurs :
   ```
   <<<<<<< HEAD
   Votre code local
   =======
   Code du dépôt distant
   >>>>>>> origin/main
   ```

2. **Éditez chaque fichier** pour résoudre les conflits :
   - Gardez le code que vous voulez
   - Supprimez les marqueurs de conflit (`<<<<<<<`, `=======`, `>>>>>>>`)

3. **Marquez les conflits comme résolus** :
   ```bash
   git add nom_du_fichier
   ```

4. **Finalisez le merge** :
   ```bash
   git commit -m "Résolution des conflits"
   ```

## Commandes utiles

```bash
# Voir l'état actuel
git status

# Voir les fichiers modifiés
git diff --name-only

# Voir la liste des stash
git stash list

# Voir le contenu d'un stash
git stash show -p stash@{0}

# Supprimer un stash
git stash drop stash@{0}
```
