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
        Schema::create('chart_data', function (Blueprint $table) {
            $table->id();
            $table->string('chart_type'); // 'line' ou 'pie'
            $table->string('name'); // Nom de la catégorie ou année
            $table->decimal('value', 10, 2); // Valeur numérique
            $table->string('color')->nullable(); // Couleur hexadécimale
            $table->integer('year')->nullable(); // Pour le graphique linéaire
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chart_data');
    }
};
