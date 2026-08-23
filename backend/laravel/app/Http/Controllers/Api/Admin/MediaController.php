<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;

/**
 * Único punto de subida de imágenes del backoffice - reutilizado por la
 * imagen principal y la galería de Proyecto, y por cualquier módulo
 * futuro que necesite adjuntar una imagen (ver ADR 0006).
 */
class MediaController extends Controller
{
    public function __construct(private readonly MediaService $mediaService) {}

    public function store(StoreMediaRequest $request)
    {
        $media = $this->mediaService->subirImagen(
            $request->file('archivo'),
            $request->input('alt_text'),
            $request->user()->id,
        );

        return MediaResource::make($media)->response()->setStatusCode(201);
    }

    public function destroy(Request $request, Media $media)
    {
        // Todas las rutas admin ya exigen sesión (auth:sanctum); aquí solo
        // se confirma que el usuario activo tenga rol de gestor - no hay
        // una MediaPolicy dedicada porque Media no tiene un dueño por fila
        // distinto del uploader, a diferencia de Proyecto.
        abort_unless($request->user()?->activo && in_array($request->user()->rol, ['admin', 'editor'], true), 403);

        $this->mediaService->eliminar($media);

        return response()->json(['ok' => true]);
    }
}
