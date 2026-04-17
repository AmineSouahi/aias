#!/bin/bash
# Script pour résoudre les conflits sur le serveur

echo "=========================================="
echo "Résolution des conflits Git"
echo "=========================================="
echo ""

# Pour les fichiers "deleted by them" - garder la version du dépôt distant (les fichiers existent déjà)
echo "1. Résolution des conflits modify/delete..."
echo "   → Garder les fichiers du dépôt distant (ils sont déjà présents)"
git add public/documents/LAssociation-Initiative-Al-Amal-pour-lIntegration-Sociale.pdf
git add public/locales/ar/common.json
git add public/locales/ar/contact.json
git add public/locales/en/common.json
git add public/locales/en/contact.json
git add public/locales/fr/common.json
git add public/locales/fr/contact.json

echo ""
echo "2. Pour les fichiers 'both modified', vous devez résoudre les conflits manuellement :"
echo "   - app/Http/Controllers/Api/SupportProjectController.php"
echo "   - resources/js/components/Header.jsx"
echo "   - resources/js/components/Hero.jsx"
echo "   - resources/js/components/SupportProjects.jsx"
echo ""
echo "3. Après résolution manuelle, exécutez :"
echo "   git add <fichier_resolu>"
echo ""
echo "4. Une fois tous les conflits résolus :"
echo "   git commit -m 'Résolution des conflits après stash pop'"
echo ""
