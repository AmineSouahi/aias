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
        Schema::table('impacts', function (Blueprint $table) {
            $table->string('icon')->nullable()->after('title');
            $table->json('graph_data')->nullable()->after('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('impacts', function (Blueprint $table) {
            $table->dropColumn(['icon', 'graph_data']);
        });
    }
};
