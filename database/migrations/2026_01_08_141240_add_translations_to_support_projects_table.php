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
        Schema::table('support_projects', function (Blueprint $table) {
            // Colonnes de traduction pour le titre
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_ar')->nullable()->after('title_fr');
            $table->string('title_en')->nullable()->after('title_ar');
            
            // Colonnes de traduction pour l'extrait
            $table->string('excerpt_fr')->nullable()->after('excerpt');
            $table->string('excerpt_ar')->nullable()->after('excerpt_fr');
            $table->string('excerpt_en')->nullable()->after('excerpt_ar');
            
            // Colonnes de traduction pour la description
            $table->text('description_fr')->nullable()->after('description');
            $table->text('description_ar')->nullable()->after('description_fr');
            $table->text('description_en')->nullable()->after('description_ar');
            
            // Colonnes de traduction pour la catégorie
            $table->string('category_fr')->nullable()->after('category');
            $table->string('category_ar')->nullable()->after('category_fr');
            $table->string('category_en')->nullable()->after('category_ar');
            
            // Colonnes de traduction pour le label du bouton CTA
            $table->string('cta_label_fr')->nullable()->after('cta_label');
            $table->string('cta_label_ar')->nullable()->after('cta_label_fr');
            $table->string('cta_label_en')->nullable()->after('cta_label_ar');
        });
        
        // Migrer les données existantes
        DB::statement('UPDATE support_projects SET title_fr = title, excerpt_fr = excerpt, description_fr = description, category_fr = category, cta_label_fr = cta_label WHERE title_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_projects', function (Blueprint $table) {
            $table->dropColumn([
                'title_fr', 'title_ar', 'title_en',
                'excerpt_fr', 'excerpt_ar', 'excerpt_en',
                'description_fr', 'description_ar', 'description_en',
                'category_fr', 'category_ar', 'category_en',
                'cta_label_fr', 'cta_label_ar', 'cta_label_en',
            ]);
        });
    }
};
