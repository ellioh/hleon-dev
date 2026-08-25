<?php

use App\Http\Controllers\Api\Admin\CertificacionController as AdminCertificacionController;
use App\Http\Controllers\Api\Admin\ExperienciaController as AdminExperienciaController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\OrganizacionController;
use App\Http\Controllers\Api\Admin\PerfilController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\ProyectoController as AdminProyectoController;
use App\Http\Controllers\Api\Admin\ServicioController as AdminServicioController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CertificacionController;
use App\Http\Controllers\Api\ExperienciaController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\ServicioController;
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
Route::get('/experiencias', [ExperienciaController::class, 'index']);
Route::get('/certificaciones', [CertificacionController::class, 'index']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);
Route::get('/servicios', [ServicioController::class, 'index']);
Route::get('/servicios/{slug}', [ServicioController::class, 'show']);
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

    Route::get('/experiencias', [AdminExperienciaController::class, 'index']);
    Route::post('/experiencias', [AdminExperienciaController::class, 'store']);
    Route::get('/experiencias/{experiencia}', [AdminExperienciaController::class, 'show'])->withTrashed();
    Route::put('/experiencias/{experiencia}', [AdminExperienciaController::class, 'update']);
    Route::delete('/experiencias/{experiencia}', [AdminExperienciaController::class, 'destroy']);
    Route::post('/experiencias/{id}/restaurar', [AdminExperienciaController::class, 'restore']);
    Route::post('/experiencias/{experiencia}/publicar', [AdminExperienciaController::class, 'publicar']);
    Route::post('/experiencias/{experiencia}/despublicar', [AdminExperienciaController::class, 'despublicar']);

    Route::get('/certificaciones', [AdminCertificacionController::class, 'index']);
    Route::post('/certificaciones', [AdminCertificacionController::class, 'store']);
    Route::get('/certificaciones/{certificacion}', [AdminCertificacionController::class, 'show'])->withTrashed();
    Route::put('/certificaciones/{certificacion}', [AdminCertificacionController::class, 'update']);
    Route::delete('/certificaciones/{certificacion}', [AdminCertificacionController::class, 'destroy']);
    Route::post('/certificaciones/{id}/restaurar', [AdminCertificacionController::class, 'restore']);

    Route::get('/posts', [AdminPostController::class, 'index']);
    Route::post('/posts', [AdminPostController::class, 'store']);
    Route::get('/posts/{post}', [AdminPostController::class, 'show'])->withTrashed();
    Route::put('/posts/{post}', [AdminPostController::class, 'update']);
    Route::delete('/posts/{post}', [AdminPostController::class, 'destroy']);
    Route::post('/posts/{id}/restaurar', [AdminPostController::class, 'restore']);
    Route::post('/posts/{post}/publicar', [AdminPostController::class, 'publicar']);
    Route::post('/posts/{post}/despublicar', [AdminPostController::class, 'despublicar']);

    Route::get('/servicios', [AdminServicioController::class, 'index']);
    Route::post('/servicios', [AdminServicioController::class, 'store']);
    Route::get('/servicios/{servicio}', [AdminServicioController::class, 'show'])->withTrashed();
    Route::put('/servicios/{servicio}', [AdminServicioController::class, 'update']);
    Route::delete('/servicios/{servicio}', [AdminServicioController::class, 'destroy']);
    Route::post('/servicios/{id}/restaurar', [AdminServicioController::class, 'restore']);

    Route::post('/media', [MediaController::class, 'store']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);

    Route::get('/organizaciones', [OrganizacionController::class, 'index']);
    Route::post('/organizaciones', [OrganizacionController::class, 'store']);

    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::put('/perfil', [PerfilController::class, 'update']);
});
