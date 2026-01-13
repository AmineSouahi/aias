<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Don extends Model
{
    protected $fillable = [
        'order_id',
        'amount',
        'currency',
        'civility',
        'full_name',
        'city',
        'country',
        'phone',
        'email',
        'accept_terms',
        'newsletter',
        'status',
        'payzone_transaction_id',
        'payzone_response',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'accept_terms' => 'boolean',
        'newsletter' => 'boolean',
    ];
}
