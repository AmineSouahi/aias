# Script de vérification avant déploiement sur Hostinger
# Vérifie que tous les fichiers nécessaires sont présents et compilés

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vérification avant déploiement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: Ce script doit être exécuté depuis la racine du projet!" -ForegroundColor Red
    exit 1
}

# 1. Vérifier les assets compilés
Write-Host "[1/7] Vérification des assets compilés..." -ForegroundColor Yellow

$buildFiles = @(
    "public/build/manifest.json",
    "public/build/assets/app-C50sj5x0.js",
    "public/build/assets/app-DvJMKyRs.css"
)

$allBuildFilesExist = $true
foreach ($file in $buildFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length / 1KB
        $sizeKB = [math]::Round($size, 2)
        Write-Host "  [OK] $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] $file MANQUANT!" -ForegroundColor Red
        $allBuildFilesExist = $false
        $errors += "Fichier manquant: $file"
    }
}

if (-not $allBuildFilesExist) {
    Write-Host ""
    Write-Host "ERREUR: Les assets ne sont pas compilés!" -ForegroundColor Red
    Write-Host "Exécutez: npm run build" -ForegroundColor Yellow
    exit 1
}

# 2. Vérifier les fichiers essentiels du dossier public
Write-Host ""
Write-Host "[2/7] Vérification des fichiers publics..." -ForegroundColor Yellow

$publicFiles = @(
    "public/index.php",
    "public/.htaccess",
    "public/robots.txt"
)

foreach ($file in $publicFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [ATTENTION] $file manquant (peut être optionnel)" -ForegroundColor Yellow
        $warnings += "Fichier manquant: $file"
    }
}

# 3. Vérifier les dossiers publics
Write-Host ""
Write-Host "[3/7] Vérification des dossiers publics..." -ForegroundColor Yellow

$publicDirs = @(
    "public/images",
    "public/documents",
    "public/locales"
)

foreach ($dir in $publicDirs) {
    if (Test-Path $dir) {
        $fileCount = (Get-ChildItem -Path $dir -Recurse -File).Count
        Write-Host "  [OK] $dir ($fileCount file(s))" -ForegroundColor Green
    } else {
        Write-Host "  [ATTENTION] $dir manquant" -ForegroundColor Yellow
        $warnings += "Dossier manquant: $dir"
    }
}

# 4. Vérifier les fichiers de configuration
Write-Host ""
Write-Host "[4/7] Vérification des fichiers de configuration..." -ForegroundColor Yellow

$configFiles = @(
    "composer.json",
    "package.json",
    ".env.example"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] $file MANQUANT!" -ForegroundColor Red
        $errors += "Fichier manquant: $file"
    }
}

# 5. Vérifier les dossiers Laravel essentiels
Write-Host ""
Write-Host "[5/7] Vérification des dossiers Laravel..." -ForegroundColor Yellow

$laravelDirs = @(
    "app",
    "bootstrap",
    "config",
    "database",
    "resources",
    "routes",
    "storage"
)

foreach ($dir in $laravelDirs) {
    if (Test-Path $dir) {
        Write-Host "  [OK] $dir/" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] $dir/ MANQUANT!" -ForegroundColor Red
        $errors += "Dossier manquant: $dir/"
    }
}

# 6. Vérifier le fichier app.blade.php
Write-Host ""
Write-Host "[6/7] Vérification du template Blade..." -ForegroundColor Yellow

if (Test-Path "resources/views/app.blade.php") {
    $content = Get-Content "resources/views/app.blade.php" -Raw
    if ($content -match "@vite") {
        Write-Host "  [OK] app.blade.php contient @vite" -ForegroundColor Green
    } else {
        Write-Host "  [ATTENTION] app.blade.php ne contient pas @vite" -ForegroundColor Yellow
        $warnings += "app.blade.php ne contient pas @vite"
    }
} else {
    Write-Host "  [ERREUR] app.blade.php MANQUANT!" -ForegroundColor Red
    $errors += "Fichier manquant: resources/views/app.blade.php"
}

# 7. Vérifier la taille totale du dossier build
Write-Host ""
Write-Host "[7/7] Vérification de la taille des assets..." -ForegroundColor Yellow

if (Test-Path "public/build") {
    $buildSize = (Get-ChildItem -Path "public/build" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "  [OK] Taille totale du dossier build: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Green
    
    if ($buildSize -lt 0.5) {
        Write-Host "  [ATTENTION] Le dossier build semble trop petit!" -ForegroundColor Yellow
        $warnings += "Dossier build trop petit ($([math]::Round($buildSize, 2)) MB)"
    }
} else {
    Write-Host "  [ERREUR] Dossier build MANQUANT!" -ForegroundColor Red
    $errors += "Dossier manquant: public/build"
}

# Résumé
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Résumé de la vérification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errors.Count -eq 0) {
    Write-Host "[OK] Aucune erreur critique trouvée!" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] $($errors.Count) erreur(s) critique(s) trouvée(s):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Corrigez ces erreurs avant de déployer!" -ForegroundColor Yellow
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "[ATTENTION] $($warnings.Count) avertissement(s):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "[OK] Prêt pour le déploiement!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "1. Uploadez le contenu de 'public/' vers 'public_html/' sur Hostinger" -ForegroundColor White
    Write-Host "2. Uploadez tous les autres dossiers au niveau parent de public_html" -ForegroundColor White
    Write-Host "3. Suivez les instructions dans UPLOAD_HOSTINGER.md" -ForegroundColor White
    exit 0
} else {
    Write-Host "[ERREUR] Des erreurs doivent être corrigées avant le déploiement" -ForegroundColor Red
    exit 1
}
