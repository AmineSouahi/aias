<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutiveMember extends Model
{
    protected $fillable = [
        'name',
        'position',
        'photo',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
