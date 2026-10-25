<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Any logged-in user (admin or regular)
    Route::apiResource('students', StudentController::class)->only(['index', 'show']);

    // Administrator only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class)->except(['index', 'show']);
    });
});