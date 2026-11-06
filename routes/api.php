<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Any logged-in user (admin or regular user)
    Route::apiResource('students', StudentController::class)->only(['index', 'show']);

    // Administrator only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class)->except(['index', 'show']);
    });
});
