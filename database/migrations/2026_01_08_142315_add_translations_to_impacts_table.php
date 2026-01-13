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
        Schema::table('impacts', function (Blueprint $table) {
            // Colonnes de traduction pour le titre
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_ar')->nullable()->after('title_fr');
            $table->string('title_en')->nullable()->after('title_ar');
        });
        
        // Migrer les données existantes
        DB::statement('UPDATE impacts SET title_fr = title WHERE title_fr IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('impacts', function (Blueprint $table) {
            $table->dropColumn([
                'title_fr', 'title_ar', 'title_en',
            ]);
        });
    }
};
