# Instructions pour ajouter les partenaires

## Étape 1 : Préparer les logos

### Partenaires du secteur privé (13 partenaires)

1. Téléchargez les logos des 13 partenaires du secteur privé
2. Placez-les dans le dossier `public/images/partners/logos/`
3. Nommez les fichiers selon cette convention :
   - `3w-academy.png` (ou .jpg, .svg)
   - `klfcom.png`
   - `cityclub.png`
   - `kezako.png`
   - `groupe-rahal.png`
   - `groupe-oncorad.png`
   - `hyatt-regency.png`
   - `technopark.png`
   - `marjane-holding.png`
   - `setec.png`
   - `istl.png`
   - `odm.png`
   - `decathlon.png`

### Partenaires éducatifs et de santé (15 partenaires)

1. Téléchargez les logos des 15 partenaires éducatifs et de santé
2. Placez-les dans le dossier `public/images/partners/logos/`
3. Nommez les fichiers selon cette convention :
   - `emsi.png`
   - `akdital.png`
   - `ispep.png`
   - `suprh.png`
   - `hestim.png`
   - `uemf.png`
   - `esig.png`
   - `hem.png`
   - `isep-casablanca.png`
   - `universite-internationale-casablanca.png`
   - `iheps.png`
   - `ecole-superieure-sciences-sante.png`
   - `e3p.png`
   - `ur.png`
   - `universite-atlantique-una.png`

## Étape 2 : Exécuter les seeders

Exécutez les commandes suivantes pour ajouter tous les partenaires :

```bash
# Partenaires du secteur privé
php artisan db:seed --class=PrivateSectorPartnersSeeder

# Partenaires éducatifs et de santé
php artisan db:seed --class=EducationalPartnersSeeder
```

## Étape 3 : Ajouter les logos via l'interface admin

1. Connectez-vous au dashboard : `/dashboard`
2. Allez dans l'onglet "Partenaires"
3. Pour chaque partenaire :
   - Cliquez sur "Modifier"
   - Uploadez le logo correspondant
   - Enregistrez les modifications

## Liste des partenaires ajoutés

### Partenaires du secteur privé (13)

1. **3W ACADEMY** - https://3wacademy.ma
2. **KLFcom** - https://klfcom.ma
3. **CityClub** - https://cityclub.ma
4. **kezako** - https://kezako.ma
5. **GROUPE RAHAL** - https://grouperahal.ma
6. **Groupe ONCORAD** - https://oncorad.ma
7. **HYATT REGENCY** - https://hyatt.com
8. **Technopark** - https://technopark.ma
9. **Marjane Holding** - https://marjane.ma
10. **setec** - https://setec.fr
11. **İSTL Formation transport logistique** - https://istl.ma
12. **ONCOLOGIE & DIAGNOSTIC DU MAROC** - https://odm.ma
13. **DECATHLON** - https://decathlon.ma

### Partenaires éducatifs et de santé (15)

1. **EMSI - École Marocaine des Sciences de l'Ingénieur** - https://emsi.ma
2. **AKDITAL** - https://akdital.ma
3. **iSpep - Institut Supérieur Privé des Études Paramédicales** - https://ispep.ma
4. **SUP'RH - School of Management** - https://suprh.ma
5. **HESTIM - Engineering & Business School** - https://hestim.ma
6. **UEMF - Université Euro-Méditerranéenne de Fès** - https://uemf.ma
7. **ESIG - École Supérieure Internationale de Gestion** - https://esig.ma
8. **HEM Business School** - https://hem.ac.ma
9. **ISEP Casablanca - Institut Supérieur des Études Paramédicales** - https://isep.ma
10. **Université Internationale de Casablanca** - https://uic.ma
11. **IHEPS** - https://iheps.ma
12. **École Supérieure des Sciences de la Santé** - https://esss.ma
13. **E3P - École Privée du Personnel Paramédical** - https://e3p.ma
14. **UR** - https://ur.ma
15. **Université Atlantique UNA** - https://una.ma

## Note importante

Les URLs des sites web sont des exemples. Veuillez les vérifier et les mettre à jour si nécessaire via l'interface admin.

