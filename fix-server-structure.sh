#!/bin/bash
# Script pour corriger automatiquement la structure sur Hostinger

echo "=========================================="
echo "Correction de la structure sur Hostinger"
echo "=========================================="
echo ""

BASE_DIR="/home/u507670352/domains/aiais.org"
PUBLIC_DIR="$BASE_DIR/public_html"

# Vérifier que nous sommes au bon endroit
if [ ! -d "$PUBLIC_DIR" ]; then
    echo "ERREUR: Le dossier $PUBLIC_DIR n'existe pas!"
    echo "Ajustez BASE_DIR dans le script si nécessaire."
    exit 1
fi

cd "$BASE_DIR" || exit 1

# Liste des fichiers/dossiers à déplacer de public_html/ vers le niveau parent
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

echo "Déplacement des fichiers depuis public_html/ vers le niveau parent..."
echo ""

MOVED_COUNT=0

for item in "${ITEMS_TO_MOVE[@]}"; do
    if [ -e "$PUBLIC_DIR/$item" ]; then
        echo "Déplacement de $item..."
        
        # Si c'est un fichier
        if [ -f "$PUBLIC_DIR/$item" ]; then
            mv "$PUBLIC_DIR/$item" "$BASE_DIR/"
            echo "  ✓ $item déplacé"
            MOVED_COUNT=$((MOVED_COUNT + 1))
        # Si c'est un dossier
        elif [ -d "$PUBLIC_DIR/$item" ]; then
            # Vérifier si le dossier existe déjà au niveau parent
            if [ -e "$BASE_DIR/$item" ]; then
                echo "  ⚠ $item existe déjà au niveau parent"
                echo "  Fusion des contenus..."
                # Copier le contenu (attention: peut écraser des fichiers)
                cp -r "$PUBLIC_DIR/$item"/* "$BASE_DIR/$item/" 2>/dev/null || true
                rm -rf "$PUBLIC_DIR/$item"
                echo "  ✓ $item fusionné et supprimé de public_html/"
            else
                mv "$PUBLIC_DIR/$item" "$BASE_DIR/"
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

# Vérifier la structure finale
echo "Vérification de la structure finale..."
echo ""

echo "Contenu de public_html/:"
ls -la "$PUBLIC_DIR" | head -20

echo ""
echo "Contenu du niveau parent:"
ls -la "$BASE_DIR" | grep -E "(resources|app|bootstrap|config|package.json|composer.json)" | head -10

echo ""
echo "✓ Correction terminée!"
echo ""
echo "IMPORTANT: Compilez les assets localement avec 'npm run build'"
echo "puis uploadez uniquement le dossier public/build/ sur le serveur."
