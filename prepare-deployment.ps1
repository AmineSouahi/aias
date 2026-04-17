# Script de préparation pour le déploiement sur Hostinger
# Ce script compile les assets et prépare les fichiers pour l'upload

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Préparation du déploiement sur Hostinger" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: Ce script doit être exécuté depuis la racine du projet!" -ForegroundColor Red
    exit 1
}

# Étape 1: Installer les dépendances npm si nécessaire
Write-Host "[1/5] Vérification des dépendances npm..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Échec de l'installation npm!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Dépendances npm déjà installées" -ForegroundColor Green
}

# Étape 2: Compiler les assets
Write-Host ""
Write-Host "[2/5] Compilation des assets React..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Échec de la compilation!" -ForegroundColor Red
    exit 1
}

# Vérifier que le dossier build existe
if (-not (Test-Path "public/build")) {
    Write-Host "ERREUR: Le dossier public/build n'a pas été créé!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Assets compilés avec succès" -ForegroundColor Green

# Étape 3: Vérifier les fichiers essentiels
Write-Host ""
Write-Host "[3/5] Vérification des fichiers essentiels..." -ForegroundColor Yellow

$requiredFiles = @(
    "public/index.php",
    "public/.htaccess",
    "public/build",
    ".env.example"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MANQUANT!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "ERREUR: Des fichiers essentiels manquent!" -ForegroundColor Red
    exit 1
}

# Étape 4: Afficher les instructions
Write-Host ""
Write-Host "[4/5] Instructions pour l'upload sur Hostinger:" -ForegroundColor Yellow
Write-Host ""
Write-Host "STRUCTURE SUR HOSTINGER:" -ForegroundColor Cyan
Write-Host "  public_html/          → Contenu du dossier 'public' de votre projet" -ForegroundColor White
Write-Host "  ../app/                → Dossier 'app' de votre projet" -ForegroundColor White
Write-Host "  ../bootstrap/          → Dossier 'bootstrap' de votre projet" -ForegroundColor White
Write-Host "  ../config/             → Dossier 'config' de votre projet" -ForegroundColor White
Write-Host "  ../database/           → Dossier 'database' de votre projet" -ForegroundColor White
Write-Host "  ../resources/          → Dossier 'resources' de votre projet" -ForegroundColor White
Write-Host "  ../routes/             → Dossier 'routes' de votre projet" -ForegroundColor White
Write-Host "  ../storage/            → Dossier 'storage' de votre projet" -ForegroundColor White
Write-Host "  ../vendor/             → Dossier 'vendor' (après composer install)" -ForegroundColor White
Write-Host "  ../.env                → Fichier de configuration" -ForegroundColor White
Write-Host "  ../composer.json       → Fichier composer.json" -ForegroundColor White
Write-Host "  ../artisan             → Fichier artisan" -ForegroundColor White
Write-Host ""

# Étape 5: Checklist
Write-Host "[5/5] Checklist de déploiement:" -ForegroundColor Yellow
Write-Host ""
Write-Host "AVANT L'UPLOAD:" -ForegroundColor Cyan
Write-Host "  [✓] Assets compilés (npm run build)" -ForegroundColor Green
Write-Host ""
Write-Host "APRÈS L'UPLOAD SUR HOSTINGER:" -ForegroundColor Cyan
Write-Host "  [ ] Uploader TOUS les fichiers du dossier 'public' vers 'public_html'" -ForegroundColor White
Write-Host "  [ ] Uploader TOUS les autres dossiers au niveau parent de public_html" -ForegroundColor White
Write-Host "  [ ] Exécuter 'composer install --no-dev' sur le serveur" -ForegroundColor White
Write-Host "  [ ] Créer le fichier .env avec les bonnes configurations" -ForegroundColor White
Write-Host "  [ ] Exécuter 'php artisan key:generate' sur le serveur" -ForegroundColor White
Write-Host "  [ ] Exécuter 'php artisan migrate --force' sur le serveur" -ForegroundColor White
Write-Host "  [ ] Exécuter 'php artisan storage:link' sur le serveur" -ForegroundColor White
Write-Host "  [ ] Exécuter 'php artisan optimize:clear' sur le serveur" -ForegroundColor White
Write-Host "  [ ] Vérifier les permissions (755 pour dossiers, 644 pour fichiers)" -ForegroundColor White
Write-Host "  [ ] Vider le cache du navigateur (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host ""

# Vérifier la taille du dossier build
$buildSize = (Get-ChildItem -Path "public/build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Taille du dossier build: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Préparation terminée avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "1. Assurez-vous que le dossier 'public/build' est bien uploadé sur Hostinger" -ForegroundColor White
Write-Host "2. Videz le cache de votre navigateur après l'upload" -ForegroundColor White
Write-Host "3. Vérifiez les logs dans storage/logs/laravel.log en cas d'erreur" -ForegroundColor White
Write-Host ""
