# Guide détaillé : Résolution des conflits sur le serveur

## Étape 1 : Résoudre les conflits "modify/delete" (facile)

Ces fichiers ont été supprimés localement mais modifiés dans le dépôt distant. **Gardons la version du dépôt distant** :

```bash
# Garder tous les fichiers du dépôt distant
git add public/documents/LAssociation-Initiative-Al-Amal-pour-lIntegration-Sociale.pdf
git add public/locales/ar/common.json
git add public/locales/ar/contact.json
git add public/locales/en/common.json
git add public/locales/en/contact.json
git add public/locales/fr/common.json
git add public/locales/fr/contact.json
```

## Étape 2 : Résoudre les conflits "both modified" (nécessite édition manuelle)

Vous devez éditer ces 4 fichiers pour résoudre les conflits :

### 2.1. Ouvrir chaque fichier et chercher les marqueurs de conflit

Les conflits sont marqués ainsi :
```
<<<<<<< Updated upstream
Code du dépôt distant (GitHub)
=======
Votre code local (du stash)
>>>>>>> Stashed changes
```

### 2.2. Fichiers à résoudre :

#### a) `app/Http/Controllers/Api/SupportProjectController.php`
```bash
# Ouvrir le fichier
nano app/Http/Controllers/Api/SupportProjectController.php
# ou
vi app/Http/Controllers/Api/SupportProjectController.php
```

#### b) `resources/js/components/Header.jsx`
```bash
nano resources/js/components/Header.jsx
```

#### c) `resources/js/components/Hero.jsx`
```bash
nano resources/js/components/Hero.jsx
```

#### d) `resources/js/components/SupportProjects.jsx`
```bash
nano resources/js/components/SupportProjects.jsx
```

### 2.3. Comment résoudre les conflits :

Pour chaque conflit dans chaque fichier :

1. **Lisez les deux versions** (celle du dépôt distant et celle de votre stash)
2. **Décidez quelle version garder** ou **combinez les deux** si nécessaire
3. **Supprimez les marqueurs** (`<<<<<<<`, `=======`, `>>>>>>>`)
4. **Gardez uniquement le code final** que vous voulez

**Exemple :**
```php
// AVANT (avec conflit)
<<<<<<< Updated upstream
public function index() {
    return SupportProject::all();
}
=======
public function index() {
    return SupportProject::with('media')->get();
}
>>>>>>> Stashed changes

// APRÈS (résolu - garder la version avec 'media')
public function index() {
    return SupportProject::with('media')->get();
}
```

### 2.4. Marquer les fichiers comme résolus

Après avoir résolu les conflits dans chaque fichier :

```bash
# Marquer chaque fichier comme résolu
git add app/Http/Controllers/Api/SupportProjectController.php
git add resources/js/components/Header.jsx
git add resources/js/components/Hero.jsx
git add resources/js/components/SupportProjects.jsx
```

## Étape 3 : Finaliser la résolution

Une fois tous les conflits résolus :

```bash
# Vérifier qu'il n'y a plus de conflits
git status

# Si tout est résolu, commiter
git commit -m "Résolution des conflits après stash pop"
```

## Option alternative : Accepter automatiquement une version

### Accepter la version du dépôt distant pour tous les fichiers en conflit :

```bash
# Pour les fichiers "both modified" - accepter la version distante
git checkout --theirs app/Http/Controllers/Api/SupportProjectController.php
git checkout --theirs resources/js/components/Header.jsx
git checkout --theirs resources/js/components/Hero.jsx
git checkout --theirs resources/js/components/SupportProjects.jsx

# Marquer comme résolu
git add app/Http/Controllers/Api/SupportProjectController.php
git add resources/js/components/Header.jsx
git add resources/js/components/Hero.jsx
git add resources/js/components/SupportProjects.jsx
```

### Accepter votre version locale (du stash) pour tous les fichiers :

```bash
# Pour les fichiers "both modified" - accepter votre version locale
git checkout --ours app/Http/Controllers/Api/SupportProjectController.php
git checkout --ours resources/js/components/Header.jsx
git checkout --ours resources/js/components/Hero.jsx
git checkout --ours resources/js/components/SupportProjects.jsx

# Marquer comme résolu
git add app/Http/Controllers/Api/SupportProjectController.php
git add resources/js/components/Header.jsx
git add resources/js/components/Hero.jsx
git add resources/js/components/SupportProjects.jsx
```

## Commandes utiles

```bash
# Voir les conflits restants
git status

# Voir les différences pour un fichier spécifique
git diff app/Http/Controllers/Api/SupportProjectController.php

# Annuler la résolution d'un fichier et recommencer
git checkout --conflict=merge app/Http/Controllers/Api/SupportProjectController.php

# Voir la liste des stash (si besoin)
git stash list

# Supprimer le stash actuel (après résolution réussie)
git stash drop
```

## Recommandation

**Pour aller plus vite**, si vos modifications locales ne sont pas critiques, acceptez la version du dépôt distant :

```bash
# 1. Résoudre les modify/delete
git add public/documents/LAssociation-Initiative-Al-Amal-pour-lIntegration-Sociale.pdf
git add public/locales/ar/common.json
git add public/locales/ar/contact.json
git add public/locales/en/common.json
git add public/locales/en/contact.json
git add public/locales/fr/common.json
git add public/locales/fr/contact.json

# 2. Accepter la version distante pour les fichiers en conflit
git checkout --theirs app/Http/Controllers/Api/SupportProjectController.php
git checkout --theirs resources/js/components/Header.jsx
git checkout --theirs resources/js/components/Hero.jsx
git checkout --theirs resources/js/components/SupportProjects.jsx

# 3. Marquer comme résolu
git add app/Http/Controllers/Api/SupportProjectController.php
git add resources/js/components/Header.jsx
git add resources/js/components/Hero.jsx
git add resources/js/components/SupportProjects.jsx

# 4. Commiter
git commit -m "Résolution des conflits - acceptation version distante"
```
