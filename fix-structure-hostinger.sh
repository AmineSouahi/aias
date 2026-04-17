#!/bin/bash
# Script pour corriger la structure sur Hostinger
# À exécuter depuis: /home/u507670352/domains/aiais.org

echo "=========================================="
echo "Correction de la structure sur Hostinger"
echo "=========================================="
echo ""

# Vérifier que nous sommes au bon endroit
if [ ! -d "public_html" ]; then
    echo "ERREUR: Le dossier public_html n'existe pas!"
    echo "Assurez-vous d'être dans: /home/u507670352/domains/aiais.org"
    exit 1
fi

echo "Répertoire actuel: $(pwd)"
echo ""

# Liste des éléments à déplacer de public_html/ vers le niveau parent
ITEMS_TO_MOVE=(
    "resources"
    "node_modules"
    "package.json"
    "composer.json"
    "app"
    "bootstrap"
    "config"
    "database"
    "routes"
    "storage"
    "vendor"
    ".env"
    "artisan"
)

MOVED_COUNT=0

echo "=== Déplacement des fichiers ==="
echo ""

for item in "${ITEMS_TO_MOVE[@]}"; do
    if [ -e "public_html/$item" ]; then
        echo "Déplacement de: $item"
        
        # Si c'est un fichier
        if [ -f "public_html/$item" ]; then
            mv "public_html/$item" .
            echo "  ✓ $item déplacé"
            MOVED_COUNT=$((MOVED_COUNT + 1))
        # Si c'est un dossier
        elif [ -d "public_html/$item" ]; then
            # Vérifier si le dossier existe déjà au niveau parent
            if [ -e "$item" ]; then
                echo "  ⚠ $item existe déjà au niveau parent"
                echo "  Fusion du contenu..."
                cp -r "public_html/$item"/* "$item/" 2>/dev/null || true
                rm -rf "public_html/$item"
                echo "  ✓ $item fusionné et supprimé de public_html/"
            else
                mv "public_html/$item" .
                echo "  ✓ $item déplacé"
                MOVED_COUNT=$((MOVED_COUNT + 1))
            fi
        fi
    fi
done

echo ""
echo "=========================================="
echo "$MOVED_COUNT élément(s) déplacé(s)"
echo "=========================================="
echo ""

# Vérification
echo "=== Vérification de la structure ==="
echo ""

echo "Fichiers dans public_html/ (ne doivent PAS inclure resources, package.json, etc.):"
ls -la public_html/ | grep -E "(resources|node_modules|package.json|composer.json|app|bootstrap|config)" || echo "✓ Aucun fichier interdit trouvé"

echo ""
echo "Fichiers au niveau parent (doivent inclure resources, package.json, etc.):"
ls -la | grep -E "(resources|package.json|composer.json|app|bootstrap|config)" | head -10

echo ""
echo "=== Structure de public_html/ ==="
ls -la public_html/ | head -15

echo ""
echo "=========================================="
echo "✓ Correction terminée!"
echo ""
echo "PROCHAINES ÉTAPES:"
echo "1. Compilez les assets localement: npm run build"
echo "2. Uploadez uniquement public/build/ vers public_html/build/"
echo "3. Videz le cache: php artisan optimize:clear"
echo "=========================================="
