<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Partner;

class PrivateSectorPartnersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partners = [
            [
                'name' => '3W ACADEMY',
                'excerpt' => 'École de formation aux métiers du numérique',
                'description' => '3W Academy est une école de formation aux métiers du numérique qui propose des formations en développement web, design, marketing digital et data. Elle forme les talents de demain pour répondre aux besoins du marché marocain et international.',
                'website_url' => 'https://3wacademy.ma',
                'logo' => null, // À remplacer par le chemin du logo après upload
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'KLFcom',
                'excerpt' => 'Agence de communication et marketing digital',
                'description' => 'KLFcom est une agence de communication et marketing digital qui accompagne les entreprises dans leur stratégie de communication et leur présence en ligne.',
                'website_url' => 'https://klfcom.ma',
                'logo' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'CityClub',
                'excerpt' => 'Réseau de clubs sportifs pour une nation sportive',
                'description' => 'CityClub est un réseau de clubs sportifs qui promeut le sport et l\'activité physique pour tous. Leur mission est de contribuer à une nation sportive et en bonne santé.',
                'website_url' => 'https://cityclub.ma',
                'logo' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'kezako',
                'excerpt' => 'Solutions innovantes et services technologiques',
                'description' => 'Kezako propose des solutions innovantes et des services technologiques pour accompagner les entreprises dans leur transformation digitale.',
                'website_url' => 'https://kezako.ma',
                'logo' => null,
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'GROUPE RAHAL',
                'excerpt' => 'Groupe industriel et commercial diversifié',
                'description' => 'Groupe RAHAL est un groupe industriel et commercial diversifié qui opère dans plusieurs secteurs d\'activité au Maroc et à l\'international.',
                'website_url' => 'https://grouperahal.ma',
                'logo' => null,
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Groupe ONCORAD',
                'excerpt' => 'Groupe spécialisé en imagerie médicale et radiologie',
                'description' => 'Groupe ONCORAD est un groupe spécialisé en imagerie médicale et radiologie, offrant des services de diagnostic de pointe pour les patients.',
                'website_url' => 'https://oncorad.ma',
                'logo' => null,
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'HYATT REGENCY',
                'excerpt' => 'Hôtel 5 étoiles de renommée internationale',
                'description' => 'Hyatt Regency est un hôtel 5 étoiles de renommée internationale qui offre des services hôteliers de luxe et des espaces pour événements et conférences.',
                'website_url' => 'https://hyatt.com',
                'logo' => null,
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Technopark',
                'excerpt' => 'Parc technologique et incubateur d\'entreprises innovantes',
                'description' => 'Technopark est un parc technologique et un incubateur d\'entreprises innovantes qui accompagne les startups et les PME dans leur développement technologique.',
                'website_url' => 'https://technopark.ma',
                'logo' => null,
                'order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Marjane Holding',
                'excerpt' => 'Groupe de distribution et retail leader au Maroc',
                'description' => 'Marjane Holding est un groupe de distribution et retail leader au Maroc, opérant dans la grande distribution, l\'immobilier et d\'autres secteurs.',
                'website_url' => 'https://marjane.ma',
                'logo' => null,
                'order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'setec',
                'excerpt' => 'Bureau d\'études et d\'ingénierie',
                'description' => 'Setec est un bureau d\'études et d\'ingénierie qui intervient dans les domaines de l\'infrastructure, du bâtiment et de l\'aménagement urbain.',
                'website_url' => 'https://setec.fr',
                'logo' => null,
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'İSTL Formation transport logistique',
                'excerpt' => 'Institut de formation spécialisé en transport et logistique',
                'description' => 'İSTL est un institut de formation spécialisé en transport et logistique qui forme les professionnels du secteur pour répondre aux besoins du marché.',
                'website_url' => 'https://istl.ma',
                'logo' => null,
                'order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'ONCOLOGIE & DIAGNOSTIC DU MAROC',
                'excerpt' => 'Centre spécialisé en oncologie et diagnostic médical',
                'description' => 'ONCOLOGIE & DIAGNOSTIC DU MAROC (ODM) est un centre spécialisé en oncologie et diagnostic médical, offrant des services de pointe pour le traitement et le diagnostic des cancers.',
                'website_url' => 'https://odm.ma',
                'logo' => null,
                'order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'DECATHLON',
                'excerpt' => 'Leader mondial de la distribution d\'articles de sport',
                'description' => 'DECATHLON est le leader mondial de la distribution d\'articles de sport, proposant une large gamme de produits pour tous les sports et toutes les activités physiques.',
                'website_url' => 'https://decathlon.ma',
                'logo' => null,
                'order' => 13,
                'is_active' => true,
            ],
        ];

        foreach ($partners as $partnerData) {
            // Vérifier si le partenaire existe déjà
            $existingPartner = Partner::where('name', $partnerData['name'])->first();
            
            if (!$existingPartner) {
                Partner::create($partnerData);
                $this->command->info("Partenaire créé : {$partnerData['name']}");
            } else {
                $this->command->warn("Partenaire déjà existant : {$partnerData['name']}");
            }
        }

        $this->command->info('Seeder des partenaires du secteur privé terminé !');
    }
}
