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
        Schema::table('slides', function (Blueprint $table) {
            // Colonnes de traduction pour le titre
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_ar')->nullable()->after('title_fr');
            $table->string('title_en')->nullable()->after('title_ar');
            
            // Colonnes de traduction pour la description
            $table->text('description_fr')->nullable()->after('description');
            $table->text('description_ar')->nullable()->after('description_fr');
            $table->text('description_en')->nullable()->after('description_ar');
            
            // Colonnes de traduction pour le texte du bouton
            $table->string('button_text_fr')->nullable()->after('button_text');
            $table->string('button_text_ar')->nullable()->after('button_text_fr');
            $table->string('button_text_en')->nullable()->after('button_text_ar');
        });
        
        // Migrer les données existantes
        DB::statement('UPDATE slides SET title_fr = title, description_fr = description, button_text_fr = button_text WHERE title_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('slides', function (Blueprint $table) {
            $table->dropColumn([
                'title_fr', 'title_ar', 'title_en',
                'description_fr', 'description_ar', 'description_en',
                'button_text_fr', 'button_text_ar', 'button_text_en',
            ]);
        });
    }
};
