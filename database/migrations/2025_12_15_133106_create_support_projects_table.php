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
            $table->string('title')->after('id');
            $table->string('excerpt')->nullable()->after('title');
            $table->text('description')->nullable()->after('excerpt');
            $table->string('image')->nullable()->after('description');
            $table->decimal('target_amount', 12, 2)->default(0)->after('image');
            $table->decimal('current_amount', 12, 2)->default(0)->after('target_amount');
            $table->string('category')->nullable()->after('current_amount');
            $table->string('cta_label')->nullable()->after('category');
            $table->string('cta_link')->nullable()->after('cta_label');
            $table->integer('order')->default(0)->after('cta_link');
            $table->boolean('is_highlighted')->default(false)->after('order');
            $table->boolean('is_active')->default(true)->after('is_highlighted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_projects', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'excerpt',
                'description',
                'image',
                'target_amount',
                'current_amount',
                'category',
                'cta_label',
                'cta_link',
                'order',
                'is_highlighted',
                'is_active',
            ]);
        });
    }
};
