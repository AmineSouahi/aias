<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartData extends Model
{
    protected $fillable = [
        'chart_type',
        'name',
        'name_fr', 'name_ar', 'name_en',
        'value',
        'color',
        'year',
        'order',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'year' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}
