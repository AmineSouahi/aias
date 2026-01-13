<?php

namespace Database\Seeders;

use App\Models\ChartData;
use Illuminate\Database\Seeder;

class ChartDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Données pour le graphique linéaire
        $lineData = [
            ['year' => 2018, 'value' => 35],
            ['year' => 2019, 'value' => 40],
            ['year' => 2020, 'value' => 35],
            ['year' => 2021, 'value' => 55],
            ['year' => 2022, 'value' => 78],
        ];

        foreach ($lineData as $data) {
            ChartData::firstOrCreate(
                [
                    'chart_type' => 'line',
                    'year' => $data['year'],
                ],
                [
                    'name' => "Année {$data['year']}",
                    'value' => $data['value'],
                    'order' => $data['year'],
                    'is_active' => true,
                ]
            );
        }

        // Données pour le graphique en camembert
        $pieData = [
            ['name' => 'NEET', 'value' => 55, 'color' => '#FBBF24', 'order' => 1],
            ['name' => 'Diplômés', 'value' => 30, 'color' => '#204F01', 'order' => 2],
            ['name' => 'Bacheliers', 'value' => 15, 'color' => '#A2140F', 'order' => 3],
        ];

        foreach ($pieData as $data) {
            ChartData::firstOrCreate(
                [
                    'chart_type' => 'pie',
                    'name' => $data['name'],
                ],
                [
                    'value' => $data['value'],
                    'color' => $data['color'],
                    'order' => $data['order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
