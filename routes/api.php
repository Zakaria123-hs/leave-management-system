<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;

// Ensure this is in routes/api.php
Route::post('/login', [AuthController::class, 'login']);


Route::get('/test-admin', function () {
    return response()->json(['message' => 'Welcome Admin']);
})->middleware(['auth:sanctum', RoleMiddleware::class . ':admin']);