# Script pour lister les fichiers du dossier build à uploader sur Hostinger

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fichiers du dossier build à uploader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$buildPath = "public\build"

if (-not (Test-Path $buildPath)) {
    Write-Host "ERREUR: Le dossier $buildPath n'existe pas!" -ForegroundColor Red
    Write-Host "Exécutez d'abord: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "Chemin local du dossier build:" -ForegroundColor Yellow
$fullPath = (Resolve-Path $buildPath).Path
Write-Host "  $fullPath" -ForegroundColor White
Write-Host ""

Write-Host "Chemin de destination sur Hostinger:" -ForegroundColor Yellow
Write-Host "  /home/u507670352/domains/aiais.org/public_html/build/" -ForegroundColor White
Write-Host ""

Write-Host "Fichiers à uploader:" -ForegroundColor Cyan
Write-Host ""

# Lister tous les fichiers
$files = Get-ChildItem -Path $buildPath -Recurse -File

foreach ($file in $files) {
    $relativePath = $file.FullName.Replace((Resolve-Path $buildPath).Path + "\", "").Replace("\", "/")
    $size = [math]::Round($file.Length / 1KB, 2)
    $destination = "public_html/build/$relativePath"
    
    Write-Host "  [OK] $relativePath" -ForegroundColor Green
    Write-Host "       Taille: $size KB" -ForegroundColor Gray
    Write-Host "       Destination: $destination" -ForegroundColor Gray
    Write-Host ""
}

$totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total: $($files.Count) fichier(s), $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Instructions d'upload:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Via FTP (FileZilla, WinSCP):" -ForegroundColor White
Write-Host "   - Connectez-vous à votre serveur Hostinger" -ForegroundColor Gray
Write-Host "   - Naviguez vers: public_html/" -ForegroundColor Gray
Write-Host "   - Uploadez TOUT le contenu du dossier 'public/build' vers 'public_html/build'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Via Gestionnaire de Fichiers Hostinger:" -ForegroundColor White
Write-Host "   - Ouvrez le panneau Hostinger" -ForegroundColor Gray
Write-Host "   - Allez dans 'Gestionnaire de Fichiers'" -ForegroundColor Gray
Write-Host "   - Naviguez vers public_html/" -ForegroundColor Gray
Write-Host "   - Créez le dossier 'build' s'il n'existe pas" -ForegroundColor Gray
Write-Host "   - Uploadez tous les fichiers listés ci-dessus" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Vérification après upload:" -ForegroundColor White
Write-Host "   - Testez: https://aiais.org/build/manifest.json" -ForegroundColor Gray
Write-Host "   - Doit afficher le contenu JSON" -ForegroundColor Gray
Write-Host ""
