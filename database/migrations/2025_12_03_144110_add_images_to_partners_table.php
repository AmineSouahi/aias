<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->string('image')->nullable()->after('logo'); // Image principale
            $table->json('images')->nullable()->after('image'); // Galerie d'images
            $table->text('excerpt')->nullable()->after('description'); // Extrait court pour les cartes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn(['image', 'images', 'excerpt']);
        });
    }
};
