# Script PowerShell pour pousser vers GitHub avec un Personal Access Token
# Usage: .\push-with-token.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Git avec Personal Access Token" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Demander le token à l'utilisateur
Write-Host "Types de tokens acceptés :" -ForegroundColor Cyan
Write-Host "  - Token classique (ghp_...) - Recommandé" -ForegroundColor White
Write-Host "  - Token fine-grained (github_pat_...)" -ForegroundColor White
Write-Host ""
$token = Read-Host "Entrez votre Personal Access Token GitHub" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

if ([string]::IsNullOrWhiteSpace($tokenPlain)) {
    Write-Host "Erreur : Le token ne peut pas être vide" -ForegroundColor Red
    exit 1
}

# Vérifier le type de token
if ($tokenPlain.StartsWith("ghp_")) {
    Write-Host "✓ Token classique détecté (recommandé)" -ForegroundColor Green
} elseif ($tokenPlain.StartsWith("github_pat_")) {
    Write-Host "⚠ Token fine-grained détecté" -ForegroundColor Yellow
    Write-Host "Pour les tokens fine-grained, assurez-vous qu'il a les permissions suivantes :" -ForegroundColor Yellow
    Write-Host "  - Contents: Read and write" -ForegroundColor Yellow
    Write-Host "  - Metadata: Read" -ForegroundColor Yellow
    Write-Host "  - Et qu'il est autorisé pour le repository 'AmineSouahi/aias'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour éviter les problèmes, utilisez un token classique (commence par ghp_)" -ForegroundColor Yellow
    Write-Host "Créez-en un ici : https://github.com/settings/tokens" -ForegroundColor Cyan
    $continue = Read-Host "Continuer avec ce token fine-grained ? (O/N)"
    if ($continue -ne "O" -and $continue -ne "o") {
        exit 1
    }
} else {
    Write-Host "⚠ Format de token non reconnu" -ForegroundColor Yellow
    Write-Host "Les tokens GitHub doivent commencer par 'ghp_' (classique) ou 'github_pat_' (fine-grained)" -ForegroundColor Yellow
    $continue = Read-Host "Continuer quand même ? (O/N)"
    if ($continue -ne "O" -and $continue -ne "o") {
        exit 1
    }
}

Write-Host ""
Write-Host "Vérification du remote Git..." -ForegroundColor Green

# Forcer un remote propre sans token stocké
$remoteUrl = "https://github.com/AmineSouahi/aias.git"
git remote set-url origin $remoteUrl

# Vérifier la configuration
Write-Host ""
Write-Host "Vérification de la configuration..." -ForegroundColor Green
git remote -v

Write-Host ""
Write-Host "Désactivation du proxy pour cette session..." -ForegroundColor Green
$env:GIT_HTTP_PROXY = ''
$env:GIT_HTTPS_PROXY = ''
$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''

Write-Host ""
Write-Host "Poussage des commits vers GitHub..." -ForegroundColor Green
Write-Host ""

# Pousser avec le token sans le stocker dans l'URL du remote
$pushUrl = "https://$tokenPlain@github.com/AmineSouahi/aias.git"
$pushOutput = git -c http.proxy= -c https.proxy= push $pushUrl main 2>&1
$pushExitCode = $LASTEXITCODE

if ($pushExitCode -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Push réussi !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    # Vérifier s'il y a des fichiers vidéo à ajouter
    $videoFiles = git status --porcelain | Select-String "public/video/"
    if ($videoFiles) {
        Write-Host ""
        Write-Host "Fichiers vidéo détectés. Voulez-vous les ajouter avec Git LFS ?" -ForegroundColor Yellow
        $addVideos = Read-Host "Ajouter les fichiers vidéo maintenant ? (O/N)"
        if ($addVideos -eq "O" -or $addVideos -eq "o") {
            Write-Host ""
            Write-Host "Ajout des fichiers vidéo avec Git LFS..." -ForegroundColor Green
            git add public/video/
            git commit -m "Add video files with Git LFS"
            git -c http.proxy= -c https.proxy= push origin main
        }
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Erreur lors du push" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    # Vérifier le type d'erreur
    if ($pushOutput -match "403" -or $pushOutput -match "Permission denied") {
        Write-Host "Erreur 403 : Permission refusée" -ForegroundColor Red
        Write-Host ""
        Write-Host "Causes possibles :" -ForegroundColor Yellow
        Write-Host "1. Le token n'a pas les permissions nécessaires" -ForegroundColor Yellow
        Write-Host "2. Le token fine-grained n'est pas autorisé pour ce repository" -ForegroundColor Yellow
        Write-Host "3. Le token a expiré ou a été révoqué" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Solutions :" -ForegroundColor Cyan
        Write-Host "→ Créez un TOKEN CLASSIQUE (plus simple) :" -ForegroundColor Cyan
        Write-Host "  1. Allez sur : https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "  2. Cliquez sur 'Generate new token' → 'Generate new token (classic)'" -ForegroundColor White
        Write-Host "  3. Cochez uniquement la permission 'repo'" -ForegroundColor White
        Write-Host "  4. Générez et copiez le token (commence par ghp_)" -ForegroundColor White
        Write-Host "  5. Relancez ce script avec le nouveau token" -ForegroundColor White
        Write-Host ""
        Write-Host "→ Si vous utilisez un token fine-grained :" -ForegroundColor Cyan
        Write-Host "  1. Vérifiez qu'il a 'Contents: Read and write' et 'Metadata: Read'" -ForegroundColor White
        Write-Host "  2. Vérifiez qu'il est autorisé pour 'AmineSouahi/aias'" -ForegroundColor White
        Write-Host "  3. Vérifiez qu'il n'a pas expiré" -ForegroundColor White
    } elseif ($pushOutput -match "401" -or $pushOutput -match "Unauthorized") {
        Write-Host "Erreur 401 : Token invalide ou expiré" -ForegroundColor Red
        Write-Host "Créez un nouveau token sur : https://github.com/settings/tokens" -ForegroundColor Yellow
    } else {
        Write-Host "Détails de l'erreur :" -ForegroundColor Yellow
        Write-Host $pushOutput -ForegroundColor Red
        Write-Host ""
        Write-Host "Vérifiez :" -ForegroundColor Yellow
        Write-Host "1. Que le token est valide et a les permissions 'repo'" -ForegroundColor Yellow
        Write-Host "2. Que vous avez une connexion Internet" -ForegroundColor Yellow
        Write-Host "3. Que les commits sont prêts à être poussés (git status)" -ForegroundColor Yellow
    }
}

# Nettoyer le token de la mémoire
$tokenPlain = $null
$token = $null