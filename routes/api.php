<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\PartnerRequestController;
use App\Http\Controllers\Api\StatisticController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\ExecutiveMemberController;
use App\Http\Controllers\Api\ImpactController;
use App\Http\Controllers\Api\SupportGoalController;
use App\Http\Controllers\Api\SupportProjectController;
use App\Http\Controllers\Api\ChartDataController;
use App\Http\Controllers\Api\DonController;

// News (API publique + dashboard)
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);
    Route::get('/news/stats', [NewsController::class, 'stats']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::post('/news/{id}', [NewsController::class, 'update']); // Using POST for PUT with FormData
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

// Partenaires (API publique + dashboard)
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/partners/all', [PartnerController::class, 'all']); // Pour le dashboard
Route::get('/partners/{id}', [PartnerController::class, 'show']);
Route::post('/partners', [PartnerController::class, 'store']);
Route::post('/partners/{id}', [PartnerController::class, 'update']); // Using POST for PUT with FormData
Route::put('/partners/{id}', [PartnerController::class, 'update']);
Route::delete('/partners/{id}', [PartnerController::class, 'destroy']);

// Statistiques / Chiffres clés (API publique + dashboard)
Route::get('/statistics', [StatisticController::class, 'index']);
Route::get('/statistics/all', [StatisticController::class, 'all']); // Pour le dashboard
Route::get('/statistics/{id}', [StatisticController::class, 'show']);
Route::post('/statistics', [StatisticController::class, 'store']);
Route::put('/statistics/{id}', [StatisticController::class, 'update']);
Route::delete('/statistics/{id}', [StatisticController::class, 'destroy']);

// Impacts (API publique + dashboard)
Route::get('/impacts', [ImpactController::class, 'index']);
Route::get('/impacts/all', [ImpactController::class, 'all']); // Pour le dashboard
Route::get('/impacts/{id}', [ImpactController::class, 'show']);
Route::post('/impacts', [ImpactController::class, 'store']);
Route::post('/impacts/{id}', [ImpactController::class, 'update']); // Using POST for PUT with FormData
Route::delete('/impacts/{id}', [ImpactController::class, 'destroy']);

// Slides / Carousel (API publique + dashboard)
Route::get('/slides', [SlideController::class, 'index']);
Route::get('/slides/all', [SlideController::class, 'all']); // Pour le dashboard
Route::get('/slides/{id}', [SlideController::class, 'show']);
Route::post('/slides', [SlideController::class, 'store']);
Route::post('/slides/{id}', [SlideController::class, 'update']); // Using POST for PUT with FormData
Route::delete('/slides/{id}', [SlideController::class, 'destroy']);

// Membres du Bureau Exécutif (API publique + dashboard)
Route::get('/executive-members', [ExecutiveMemberController::class, 'index']);
Route::get('/executive-members/all', [ExecutiveMemberController::class, 'all']); // Pour le dashboard
Route::get('/executive-members/{id}', [ExecutiveMemberController::class, 'show']);
Route::post('/executive-members', [ExecutiveMemberController::class, 'store']);
Route::post('/executive-members/{id}', [ExecutiveMemberController::class, 'update']); // Using POST for PUT with FormData
Route::delete('/executive-members/{id}', [ExecutiveMemberController::class, 'destroy']);

// Chart Data (API publique + dashboard)
Route::get('/chart-data', [ChartDataController::class, 'index']);
Route::get('/chart-data/all', [ChartDataController::class, 'all']); // Pour le dashboard
Route::get('/chart-data/{id}', [ChartDataController::class, 'show']);
Route::post('/chart-data', [ChartDataController::class, 'store']);
Route::put('/chart-data/{id}', [ChartDataController::class, 'update']);
Route::delete('/chart-data/{id}', [ChartDataController::class, 'destroy']);

// Support Goals (objectifs de dons) - API publique + dashboard
Route::get('/support-goals', [SupportGoalController::class, 'index']);
Route::get('/support-goals/all', [SupportGoalController::class, 'all']); // Pour le dashboard
Route::get('/support-goals/{id}', [SupportGoalController::class, 'show']);
Route::post('/support-goals', [SupportGoalController::class, 'store']);
Route::put('/support-goals/{id}', [SupportGoalController::class, 'update']);
Route::delete('/support-goals/{id}', [SupportGoalController::class, 'destroy']);

// Support Projects (projets à financer) - API publique + dashboard
Route::get('/support-projects', [SupportProjectController::class, 'index']);
Route::get('/support-projects/all', [SupportProjectController::class, 'all']); // Pour le dashboard
Route::get('/support-projects/{id}', [SupportProjectController::class, 'show']);
Route::post('/support-projects', [SupportProjectController::class, 'store']);
Route::put('/support-projects/{id}', [SupportProjectController::class, 'update']);
Route::delete('/support-projects/{id}', [SupportProjectController::class, 'destroy']);

// Contact
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/contacts', [ContactController::class, 'index']); // Pour le dashboard
Route::get('/contacts/{id}', [ContactController::class, 'show']);
Route::put('/contacts/{id}/read', [ContactController::class, 'markAsRead']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

// Demandes de partenariat
Route::post('/partner-requests', [PartnerRequestController::class, 'store']);

// Dons (API publique)
Route::post('/don', [DonController::class, 'store']);
Route::post('/don/callback', [DonController::class, 'callback']); // Callback Payzone

