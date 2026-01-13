<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Impact extends Model
{
    protected $fillable = [
        'title',
        'title_fr', 'title_ar', 'title_en',
        'icon',
        'value',
        'graph_data',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'graph_data' => 'array',
    ];
}
