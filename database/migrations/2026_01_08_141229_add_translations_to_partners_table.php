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
        Schema::table('partners', function (Blueprint $table) {
            // Colonnes de traduction pour le nom
            $table->string('name_fr')->nullable()->after('name');
            $table->string('name_ar')->nullable()->after('name_fr');
            $table->string('name_en')->nullable()->after('name_ar');
            
            // Colonnes de traduction pour la description
            $table->text('description_fr')->nullable()->after('description');
            $table->text('description_ar')->nullable()->after('description_fr');
            $table->text('description_en')->nullable()->after('description_ar');
            
            // Colonnes de traduction pour l'extrait
            $table->text('excerpt_fr')->nullable()->after('excerpt');
            $table->text('excerpt_ar')->nullable()->after('excerpt_fr');
            $table->text('excerpt_en')->nullable()->after('excerpt_ar');
        });
        
        // Migrer les données existantes
        DB::statement('UPDATE partners SET name_fr = name, description_fr = description, excerpt_fr = excerpt WHERE name_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn([
                'name_fr', 'name_ar', 'name_en',
                'description_fr', 'description_ar', 'description_en',
                'excerpt_fr', 'excerpt_ar', 'excerpt_en',
            ]);
        });
    }
};
