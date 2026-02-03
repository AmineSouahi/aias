<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportProject extends Model
{
    protected $fillable = [
        'title',
        'title_fr', 'title_ar', 'title_en',
        'excerpt',
        'excerpt_fr', 'excerpt_ar', 'excerpt_en',
        'description',
        'description_fr', 'description_ar', 'description_en',
        'image',
        'video',
        'photos',
        'target_amount',
        'current_amount',
        'category',
        'category_fr', 'category_ar', 'category_en',
        'cta_label',
        'cta_label_fr', 'cta_label_ar', 'cta_label_en',
        'cta_link',
        'order',
        'is_highlighted',
        'is_active',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'order' => 'integer',
        'is_highlighted' => 'boolean',
        'is_active' => 'boolean',
        'photos' => 'array',
    ];
}
