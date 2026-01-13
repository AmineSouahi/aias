<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Payzone Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'intégration de Payzone, la passerelle de paiement
    | marocaine. Ces valeurs sont chargées depuis le fichier .env
    |
    */

    'merchant_id' => env('PAYZONE_MERCHANT_ID', ''),
    'api_key' => env('PAYZONE_API_KEY', ''),
    'api_secret' => env('PAYZONE_API_SECRET', ''),
    'base_url' => env('PAYZONE_BASE_URL', 'https://payment.payzone.ma/pwthree/launch'),
    
    /*
    |--------------------------------------------------------------------------
    | URLs de callback
    |--------------------------------------------------------------------------
    |
    | URLs de retour après le paiement. Ces URLs doivent être accessibles
    | publiquement pour que Payzone puisse y envoyer les notifications.
    |
    */
    
    'return_url' => env('APP_URL') . '/don/return',
    'cancel_url' => env('APP_URL') . '/don/cancel',
    'notify_url' => env('APP_URL') . '/api/don/callback',
];

