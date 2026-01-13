<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\DonController;

// Routes d'authentification (avec sessions)
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:web');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:web');
});

// Routes pour les callbacks Payzone (doivent être en web pour les redirections)
Route::get('/don/return', [DonController::class, 'return']);
Route::get('/don/cancel', [DonController::class, 'cancel']);

// Route catch-all pour React Router
Route::view('/{any?}', 'app')->where('any', '.*');
