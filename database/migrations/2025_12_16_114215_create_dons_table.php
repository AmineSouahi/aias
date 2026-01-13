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
        Schema::create('dons', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // ID unique pour Payzone
            $table->decimal('amount', 10, 2); // Montant du don
            $table->string('currency', 3)->default('MAD'); // Devise
            $table->enum('civility', ['M.', 'Mme'])->nullable(); // Civilité
            $table->string('full_name'); // Nom et prénom
            $table->string('city')->nullable(); // Ville
            $table->string('country')->default('Maroc'); // Pays
            $table->string('phone')->nullable(); // Téléphone
            $table->string('email'); // Email
            $table->boolean('accept_terms')->default(false); // Acceptation des conditions
            $table->boolean('newsletter')->default(false); // Newsletter
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending'); // Statut du paiement
            $table->string('payzone_transaction_id')->nullable(); // ID transaction Payzone
            $table->text('payzone_response')->nullable(); // Réponse complète de Payzone
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dons');
    }
};
