# 🔧 Vider les caches sur Hostinger

## ❌ Erreur actuelle

```
Could not open input file: artisan
```

Cela signifie que le fichier `artisan` n'est pas dans le répertoire courant.

## ✅ Solutions

### Solution 1 : Trouver où se trouve artisan

```bash
# Chercher le fichier artisan
find /home/u507670352/domains/aiais.org -name "artisan" -type f 2>/dev/null

# Ou vérifier les emplacements possibles
ls -la /home/u507670352/domains/aiais.org/artisan
ls -la /home/u507670352/domains/aiais.org/public_html/artisan
```

### Solution 2 : Utiliser le chemin complet

Une fois que vous avez trouvé où est `artisan`, utilisez le chemin complet :

```bash
# Si artisan est au niveau parent
php /home/u507670352/domains/aiais.org/artisan optimize:clear

# Si artisan est ailleurs, ajustez le chemin
```

### Solution 3 : Utiliser le script PHP (PLUS SIMPLE)

Au lieu d'utiliser `artisan`, utilisez le fichier `clear-all-cache.php` :

1. **Uploadez le fichier `clear-all-cache.php`** dans `public_html/`

2. **Accédez à :** `https://aiais.org/clear-all-cache.php`

3. **Supprimez le fichier** après utilisation pour la sécurité

### Solution 4 : Vider les caches manuellement

Si `artisan` n'est pas accessible, vous pouvez vider les caches manuellement :

```bash
cd /home/u507670352/domains/aiais.org

# Supprimer les fichiers de cache
rm -rf bootstrap/cache/*.php
rm -rf storage/framework/cache/data/*
rm -rf storage/framework/views/*.php
rm -rf storage/framework/sessions/*

# Vérifier que les dossiers existent toujours
ls -la bootstrap/cache/
ls -la storage/framework/cache/
```

## 🎯 Solution recommandée : Utiliser clear-all-cache.php

C'est la méthode la plus simple :

1. **Uploadez** `clear-all-cache.php` dans `public_html/`
2. **Accédez** à `https://aiais.org/clear-all-cache.php` dans votre navigateur
3. **Vérifiez** que les caches sont vidés
4. **Supprimez** le fichier `clear-all-cache.php` pour la sécurité

## 📋 Vérification de la structure

Vérifiez où se trouvent les fichiers :

```bash
cd /home/u507670352/domains/aiais.org

# Vérifier la structure
ls -la

# Chercher artisan
find . -name "artisan" -type f 2>/dev/null

# Vérifier où est le projet Laravel
ls -la | grep -E "(artisan|composer.json|app|bootstrap)"
```

Le fichier `artisan` doit être au même niveau que `app/`, `bootstrap/`, `config/`, etc.
