<?php

use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\OrganizacionController;
use App\Http\Controllers\Api\Admin\ProyectoController as AdminProyectoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\TecnologiaController;
use Illuminate\Support\Facades\Route;

// Auth por cookie de sesión (Sanctum SPA) - login es público, el resto
// exige sesión activa. Sin prefijo de versión todavía: con un solo
// consumidor propio (admin.hleon.dev) no hay necesidad de /v1 aún.
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// --- Público (consumido por apps/web) ---
Route::get('/proyectos', [ProyectoController::class, 'index']);
Route::get('/proyectos/{slug}', [ProyectoController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/tecnologias', [TecnologiaController::class, 'index']);

// --- Admin (consumido por apps/admin, exige sesión) ---
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/proyectos', [AdminProyectoController::class, 'index']);
    Route::post('/proyectos', [AdminProyectoController::class, 'store']);
    Route::get('/proyectos/{proyecto}', [AdminProyectoController::class, 'show'])->withTrashed();
    Route::put('/proyectos/{proyecto}', [AdminProyectoController::class, 'update']);
    Route::delete('/proyectos/{proyecto}', [AdminProyectoController::class, 'destroy']);
    Route::post('/proyectos/{id}/restaurar', [AdminProyectoController::class, 'restore']);
    Route::post('/proyectos/{proyecto}/publicar', [AdminProyectoController::class, 'publicar']);
    Route::post('/proyectos/{proyecto}/despublicar', [AdminProyectoController::class, 'despublicar']);
    Route::put('/proyectos/{proyecto}/galeria', [AdminProyectoController::class, 'actualizarGaleria']);

    Route::post('/media', [MediaController::class, 'store']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);

    Route::get('/organizaciones', [OrganizacionController::class, 'index']);
    Route::post('/organizaciones', [OrganizacionController::class, 'store']);
});
