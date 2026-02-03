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
        Schema::table('support_projects', function (Blueprint $table) {
            if (!Schema::hasColumn('support_projects', 'video')) {
                $table->string('video')->nullable()->after('image');
            }
            if (!Schema::hasColumn('support_projects', 'photos')) {
                $table->json('photos')->nullable()->after('video');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_projects', function (Blueprint $table) {
            if (Schema::hasColumn('support_projects', 'video')) {
                $table->dropColumn('video');
            }
            if (Schema::hasColumn('support_projects', 'photos')) {
                $table->dropColumn('photos');
            }
        });
    }
};
