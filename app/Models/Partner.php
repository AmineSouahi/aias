<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'name_fr', 'name_ar', 'name_en',
        'logo',
        'image',
        'images',
        'excerpt',
        'excerpt_fr', 'excerpt_ar', 'excerpt_en',
        'description',
        'description_fr', 'description_ar', 'description_en',
        'website_url',
        'beneficiaries_count',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'beneficiaries_count' => 'integer',
        'images' => 'array',
    ];
}
