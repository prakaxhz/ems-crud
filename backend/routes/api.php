<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public Authentication Routes ────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ── Protected Routes (Sanctum token required) ───────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Employees
    Route::prefix('employees')->group(function () {
        Route::get('/stats', [EmployeeController::class, 'stats']);
        Route::get('/next-id', [EmployeeController::class, 'nextId']);
        Route::get('/export', [EmployeeController::class, 'export']);
        Route::post('/import', [EmployeeController::class, 'import']);
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::put('/{id}', [EmployeeController::class, 'update']);
        Route::post('/{id}', [EmployeeController::class, 'update']);
        Route::delete('/{id}', [EmployeeController::class, 'destroy']);
        Route::get('/{id}/photo', [EmployeeController::class, 'photo']);
        Route::get('/{id}/resume', [EmployeeController::class, 'resume']);
    });
});
