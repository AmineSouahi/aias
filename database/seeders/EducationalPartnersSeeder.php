<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Partner;

class EducationalPartnersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $partners = [
            [
                'name' => 'EMSI - École Marocaine des Sciences de l\'Ingénieur',
                'excerpt' => 'École d\'ingénieurs membre de HONORIS UNITED UNIVERSITIES',
                'description' => 'L\'École Marocaine des Sciences de l\'Ingénieur (EMSI) est une école d\'ingénieurs reconnue, membre de HONORIS UNITED UNIVERSITIES. Elle forme des ingénieurs dans divers domaines technologiques et scientifiques.',
                'website_url' => 'https://emsi.ma',
                'logo' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'AKDITAL',
                'excerpt' => 'Groupe de santé : des soins et des liens',
                'description' => 'AKDITAL est un groupe de santé qui offre des soins médicaux de qualité et crée des liens avec les patients et leurs familles. Leur mission est de rendre les soins de santé accessibles à tous.',
                'website_url' => 'https://akdital.ma',
                'logo' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'iSpep - Institut Supérieur Privé des Études Paramédicales',
                'excerpt' => 'Formation aux métiers paramédicaux',
                'description' => 'iSpep est un institut supérieur privé spécialisé dans la formation aux métiers paramédicaux, préparant les étudiants aux carrières dans le domaine de la santé.',
                'website_url' => 'https://ispep.ma',
                'logo' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'SUP\'RH - School of Management',
                'excerpt' => 'École de management et ressources humaines',
                'description' => 'SUP\'RH est une école de management spécialisée dans les ressources humaines et la gestion, formant les futurs managers et professionnels RH.',
                'website_url' => 'https://suprh.ma',
                'logo' => null,
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'HESTIM - Engineering & Business School',
                'excerpt' => 'École d\'ingénierie et de management',
                'description' => 'HESTIM est une école combinant ingénierie et business, offrant des formations complètes pour les futurs ingénieurs-managers et entrepreneurs.',
                'website_url' => 'https://hestim.ma',
                'logo' => null,
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'UEMF - Université Euro-Méditerranéenne de Fès',
                'excerpt' => 'Université internationale au cœur du Maroc',
                'description' => 'L\'Université Euro-Méditerranéenne de Fès (UEMF) est une université internationale qui promeut l\'excellence académique et la coopération euro-méditerranéenne.',
                'website_url' => 'https://uemf.ma',
                'logo' => null,
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'ESIG - École Supérieure Internationale de Gestion',
                'excerpt' => 'École de gestion et management international',
                'description' => 'L\'École Supérieure Internationale de Gestion (ESIG) forme les futurs managers et dirigeants d\'entreprise dans un contexte international.',
                'website_url' => 'https://esig.ma',
                'logo' => null,
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'HEM Business School',
                'excerpt' => 'École de commerce et management',
                'description' => 'HEM Business School est une école de commerce reconnue qui forme les futurs dirigeants et entrepreneurs dans les domaines du management et de la finance.',
                'website_url' => 'https://hem.ac.ma',
                'logo' => null,
                'order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'ISEP Casablanca - Institut Supérieur des Études Paramédicales',
                'excerpt' => 'Formation paramédicale : Apprendre pour Servir',
                'description' => 'ISEP Casablanca est un institut supérieur spécialisé dans les études paramédicales, formant les professionnels de santé avec la devise "Apprendre pour Servir".',
                'website_url' => 'https://isep.ma',
                'logo' => null,
                'order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Université Internationale de Casablanca',
                'excerpt' => 'Université reconnue par l\'État',
                'description' => 'L\'Université Internationale de Casablanca (UIC) est une université reconnue par l\'État qui offre des formations de qualité dans divers domaines académiques.',
                'website_url' => 'https://uic.ma',
                'logo' => null,
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'IHEPS',
                'excerpt' => 'Institut de formation et d\'éducation',
                'description' => 'IHEPS est un institut de formation et d\'éducation qui prépare les étudiants aux carrières dans l\'enseignement et l\'éducation.',
                'website_url' => 'https://iheps.ma',
                'logo' => null,
                'order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'École Supérieure des Sciences de la Santé',
                'excerpt' => 'Formation aux sciences de la santé',
                'description' => 'L\'École Supérieure des Sciences de la Santé forme les professionnels de santé dans divers domaines médicaux et paramédicaux.',
                'website_url' => 'https://esss.ma',
                'logo' => null,
                'order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'E3P - École Privée du Personnel Paramédical',
                'excerpt' => 'Formation spécialisée en personnel paramédical',
                'description' => 'E3P est une école privée spécialisée dans la formation du personnel paramédical, préparant les étudiants aux métiers de la santé.',
                'website_url' => 'https://e3p.ma',
                'logo' => null,
                'order' => 13,
                'is_active' => true,
            ],
            [
                'name' => 'UR',
                'excerpt' => 'Institution éducative',
                'description' => 'UR est une institution éducative qui contribue à la formation et au développement des compétences.',
                'website_url' => 'https://ur.ma',
                'logo' => null,
                'order' => 14,
                'is_active' => true,
            ],
            [
                'name' => 'Université Atlantique UNA',
                'excerpt' => 'Université moderne et innovante',
                'description' => 'L\'Université Atlantique (UNA) est une université moderne et innovante qui offre des formations de qualité dans un environnement académique dynamique.',
                'website_url' => 'https://una.ma',
                'logo' => null,
                'order' => 15,
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

        $this->command->info('Seeder des partenaires éducatifs et de santé terminé !');
    }
}

