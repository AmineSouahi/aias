<?php
/**
 * Script pour vider tous les caches Laravel
 * À placer dans public_html/ et accéder via : https://aiais.org/clear-all-cache.php
 * SUPPRIMEZ CE FICHIER APRÈS UTILISATION pour des raisons de sécurité !
 */

// Charger Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Vider tous les caches
try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    
    echo "<h1>Nettoyage des caches Laravel</h1>";
    echo "<pre>";
    
    // Vider tous les caches
    $kernel->call('optimize:clear');
    echo "\n✓ optimize:clear exécuté\n";
    
    $kernel->call('config:clear');
    echo "✓ config:clear exécuté\n";
    
    $kernel->call('cache:clear');
    echo "✓ cache:clear exécuté\n";
    
    $kernel->call('route:clear');
    echo "✓ route:clear exécuté\n";
    
    $kernel->call('view:clear');
    echo "✓ view:clear exécuté\n";
    
    echo "\n✅ Tous les caches ont été vidés avec succès !\n";
    echo "\n⚠️ IMPORTANT : Supprimez ce fichier maintenant pour des raisons de sécurité !\n";
    echo "</pre>";
    
} catch (Exception $e) {
    echo "<h1>Erreur</h1>";
    echo "<pre>";
    echo "Erreur : " . $e->getMessage();
    echo "</pre>";
}
