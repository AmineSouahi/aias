# Guide de Configuration et Test de la Connexion Admin

## 🚀 Étapes pour tester la connexion

### 1. Préparer la base de données

Assurez-vous d'avoir exécuté les migrations et le seeder :

```bash
# Exécuter les migrations
php artisan migrate

# Créer l'utilisateur admin par défaut
php artisan db:seed
```

### 2. Identifiants de connexion

L'utilisateur admin par défaut a été créé avec :
- **Email** : `admin@cdda.ma`
- **Mot de passe** : `admin123`

### 3. Accéder à la page de connexion

Ouvrez votre navigateur et allez à :
```
http://localhost:8000/login
```

### 4. Se connecter

1. Entrez l'email : `admin@cdda.ma`
2. Entrez le mot de passe : `admin123`
3. Cliquez sur "Se connecter"

Vous serez automatiquement redirigé vers le dashboard à `/dashboard`

### 5. Fonctionnalités disponibles après connexion

- ✅ Gestion des News (créer, modifier, supprimer)
- ✅ Statistiques des News
- ✅ Dashboard avec vue d'ensemble

## 🔧 Si vous avez des problèmes

### Problème : "Email ou mot de passe incorrect"
- Vérifiez que vous avez bien exécuté `php artisan db:seed`
- Vérifiez que la base de données est bien configurée dans `.env`

### Problème : Erreur 500
- Vérifiez les logs : `storage/logs/laravel.log`
- Vérifiez que les sessions sont bien configurées

### Problème : La page de login ne s'affiche pas
- Vérifiez que le serveur de développement est lancé : `npm run dev`
- Vérifiez que les routes sont bien configurées

## 📝 Créer un nouvel utilisateur admin

Si vous voulez créer un autre utilisateur admin, vous pouvez utiliser Tinker :

```bash
php artisan tinker
```

Puis dans Tinker :
```php
User::create([
    'name' => 'Votre Nom',
    'email' => 'votre@email.com',
    'password' => Hash::make('votre_mot_de_passe'),
    'email_verified_at' => now(),
]);
```



