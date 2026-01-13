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
        Schema::table('news', function (Blueprint $table) {
            // Colonnes de traduction pour le titre
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_ar')->nullable()->after('title_fr');
            $table->string('title_en')->nullable()->after('title_ar');
            
            // Colonnes de traduction pour l'extrait
            $table->text('excerpt_fr')->nullable()->after('excerpt');
            $table->text('excerpt_ar')->nullable()->after('excerpt_fr');
            $table->text('excerpt_en')->nullable()->after('excerpt_ar');
            
            // Colonnes de traduction pour le contenu
            $table->text('content_fr')->nullable()->after('content');
            $table->text('content_ar')->nullable()->after('content_fr');
            $table->text('content_en')->nullable()->after('content_ar');
        });
        
        // Migrer les données existantes : copier title, excerpt, content vers les colonnes _fr
        DB::statement('UPDATE news SET title_fr = title, excerpt_fr = excerpt, content_fr = content WHERE title_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn([
                'title_fr', 'title_ar', 'title_en',
                'excerpt_fr', 'excerpt_ar', 'excerpt_en',
                'content_fr', 'content_ar', 'content_en',
            ]);
        });
    }
};
