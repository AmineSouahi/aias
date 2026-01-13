<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    protected $fillable = [
        'title',
        'title_fr', 'title_ar', 'title_en',
        'description',
        'description_fr', 'description_ar', 'description_en',
        'image',
        'button_text',
        'button_text_fr', 'button_text_ar', 'button_text_en',
        'button_link',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
