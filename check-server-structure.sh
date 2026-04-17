#!/bin/bash
# Script pour vérifier et corriger la structure sur Hostinger

echo "=========================================="
echo "Vérification de la structure sur Hostinger"
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

echo "Répertoire de base: $BASE_DIR"
echo "Répertoire public: $PUBLIC_DIR"
echo ""

# Liste des fichiers/dossiers qui NE DOIVENT PAS être dans public_html/
FORBIDDEN_IN_PUBLIC=(
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

# Liste des fichiers/dossiers qui DOIVENT être dans public_html/
REQUIRED_IN_PUBLIC=(
    "index.php"
    ".htaccess"
    "build"
)

echo "=== Vérification des fichiers interdits dans public_html/ ==="
echo ""

HAS_ERRORS=false

for item in "${FORBIDDEN_IN_PUBLIC[@]}"; do
    if [ -e "$PUBLIC_DIR/$item" ]; then
        echo "❌ ERREUR: $item est dans public_html/ (ne devrait pas y être)"
        HAS_ERRORS=true
    else
        echo "✓ $item n'est pas dans public_html/"
    fi
done

echo ""
echo "=== Vérification des fichiers requis dans public_html/ ==="
echo ""

for item in "${REQUIRED_IN_PUBLIC[@]}"; do
    if [ -e "$PUBLIC_DIR/$item" ]; then
        echo "✓ $item est présent dans public_html/"
    else
        echo "⚠ ATTENTION: $item n'est pas dans public_html/"
    fi
done

echo ""
echo "=== Vérification de la structure au niveau parent ==="
echo ""

REQUIRED_IN_PARENT=(
    "resources"
    "app"
    "bootstrap"
    "config"
    "routes"
    "storage"
    "composer.json"
    "package.json"
    "artisan"
)

for item in "${REQUIRED_IN_PARENT[@]}"; do
    if [ -e "$BASE_DIR/$item" ]; then
        echo "✓ $item est présent au niveau parent"
    else
        echo "⚠ ATTENTION: $item n'est pas au niveau parent"
    fi
done

echo ""
echo "=========================================="

if [ "$HAS_ERRORS" = true ]; then
    echo "❌ Des erreurs ont été détectées!"
    echo ""
    echo "Pour corriger automatiquement, exécutez:"
    echo "  ./fix-server-structure.sh"
    echo ""
    echo "Ou déplacez manuellement les fichiers depuis public_html/ vers le niveau parent."
    exit 1
else
    echo "✓ Structure correcte!"
    exit 0
fi
