<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('chart_data', function (Blueprint $table) {
            // Colonnes de traduction pour le nom (label du graphique)
            $table->string('name_fr')->nullable()->after('name');
            $table->string('name_ar')->nullable()->after('name_fr');
            $table->string('name_en')->nullable()->after('name_ar');
        });
        
        // Migrer les données existantes
        DB::statement('UPDATE chart_data SET name_fr = name WHERE name_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chart_data', function (Blueprint $table) {
            $table->dropColumn([
                'name_fr', 'name_ar', 'name_en',
            ]);
        });
    }
};
