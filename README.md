# Association Initiative Al Amal Pour L'integration Sociale

Site web officiel de l'Association Initiative Al Amal Pour L'integration Sociale, développé avec Laravel (backend) et React.js (frontend).

## 🎨 Thème

Le site utilise les couleurs suivantes :
- **Rouge primaire** : `#A2140F`
- **Vert secondaire** : `#204F01`

## 🚀 Technologies

- **Backend** : Laravel 12
- **Frontend** : React.js 18
- **Build Tool** : Vite
- **CSS Framework** : Tailwind CSS 4
- **Base de données** : SQLite (par défaut)

## 📋 Prérequis

- PHP 8.2 ou supérieur
- Composer
- Node.js 18+ et npm
- SQLite (ou MySQL/PostgreSQL)

## 🔧 Installation

1. **Cloner le projet** (si applicable) ou naviguer vers le dossier du projet

2. **Installer les dépendances PHP** :
```bash
composer install
```

3. **Installer les dépendances Node.js** :
```bash
npm install
```

4. **Configurer l'environnement** :
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurer la base de données** :
   - Modifiez le fichier `.env` si nécessaire
   - Par défaut, SQLite est utilisé (`database/database.sqlite`)

6. **Exécuter les migrations** :
```bash
php artisan migrate
```

7. **Compiler les assets** :
```bash
npm run build
```

## 🏃 Développement

Pour démarrer le serveur de développement :

```bash
# Terminal 1 : Serveur Laravel
php artisan serve

# Terminal 2 : Vite (hot reload)
npm run dev
```

Le site sera accessible à `http://localhost:8000`

## 📁 Structure du Projet

```
aiais/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── NewsController.php
│   │           └── ContactController.php
│   └── Models/
│       ├── News.php
│       └── Contact.php
├── database/
│   └── migrations/
│       ├── create_news_table.php
│       └── create_contacts_table.php
├── resources/
│   ├── js/
│   │   ├── app.jsx
│   │   ├── bootstrap.js
│   │   └── components/
│   │       ├── App.jsx
│   │       ├── Header.jsx
│   │       ├── Hero.jsx
│   │       ├── About.jsx
│   │       ├── News.jsx
│   │       ├── Contact.jsx
│   │       └── Footer.jsx
│   ├── css/
│   │   └── app.css
│   └── views/
│       └── app.blade.php
└── routes/
    ├── web.php
    └── api.php
```

## 🎯 Fonctionnalités

- ✅ Page d'accueil avec carousel
- ✅ Section "Qui nous sommes"
- ✅ Section "Ce que nous faisons"
- ✅ Section News (actualités)
- ✅ Formulaire de contact
- ✅ Section donation
- ✅ Design responsive
- ✅ API REST pour les données

## 📡 API Endpoints

### News
- `GET /api/news` - Liste des actualités
- `GET /api/news/{id}` - Détails d'une actualité

### Contact
- `POST /api/contact` - Envoyer un message de contact

## 🗄️ Base de Données

### Table `news`
- `id` - Identifiant unique
- `title` - Titre de l'actualité
- `excerpt` - Extrait
- `content` - Contenu complet (optionnel)
- `image` - URL de l'image (optionnel)
- `published_at` - Date de publication
- `is_published` - Statut de publication
- `created_at`, `updated_at` - Timestamps

### Table `contacts`
- `id` - Identifiant unique
- `name` - Nom du contact
- `email` - Email
- `phone` - Téléphone (optionnel)
- `message` - Message
- `is_read` - Statut de lecture
- `created_at`, `updated_at` - Timestamps

## 🎨 Personnalisation

Les couleurs du thème sont définies dans `resources/css/app.css` :
```css
--color-primary: #A2140F;
--color-secondary: #204F01;
```

## 📝 Notes

- Les images du carousel utilisent actuellement des URLs Unsplash. Remplacez-les par vos propres images.
- Le formulaire de contact enregistre les messages dans la base de données. Configurez l'envoi d'emails dans `ContactController.php` si nécessaire.

## 📄 Licence

Ce projet est développé pour l'Association Initiative Al Amal Pour L'integration Sociale.
