<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Ensure this is in routes/api.php
Route::post('/login', [AuthController::class, 'login']);