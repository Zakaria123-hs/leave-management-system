<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware
;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ManagerLeaveController;
use App\Http\Controllers\HRLeaveContoller;
// Ensure this is in routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum', 'role:employee'])->group(function () {
    // Route to submit a new leave request
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    // Optional: Route to see my own history (it's good to have this too)
    // Route::get('/leave-requests/me', [LeaveRequestController::class, 'myHistory']);
});

Route::middleware(['auth:sanctum', 'role:manager'])->group(function () {
    Route::post('/leave/approve/{id}', [ManagerLeaveController::class, 'approve']);
    Route::post('/leave/reject/{id}', [ManagerLeaveController::class, 'reject']);
    Route::get('/leave-requests/pending', [ManagerLeaveController::class, 'pendingRequests']);
});

Route::middleware(['auth:sanctum', 'role:hr'])->group( function () {
    Route::get('/hr/approved-requests', [HRLeaveContoller::class, 'hrReport']);
});