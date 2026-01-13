<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportGoal extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'target_amount',
        'current_amount',
        'start_date',
        'end_date',
        'deadline',
        'is_highlighted',
        'order',
        'is_active',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_highlighted' => 'boolean',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];
}
