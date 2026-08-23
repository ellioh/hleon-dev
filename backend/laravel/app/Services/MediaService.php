<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

/**
 * Reutilizable por cualquier módulo que suba imágenes (Proyecto hoy;
 * Post/Servicio/Certificación después, ver ADR 0006) - un solo lugar
 * para la política de redimensionado/optimización, no una por módulo.
 *
 * Toda imagen subida se reescala (nunca se agranda) a un ancho máximo y
 * se recodifica a WebP - sin esto, una foto sin comprimir subida desde un
 * teléfono puede pesar varios MB y pegarle directo al rendimiento.
 */
class MediaService
{
    private const ANCHO_MAXIMO = 1920;

    private const CALIDAD_WEBP = 82;

    public function __construct(private readonly ImageManager $imageManager) {}

    public function subirImagen(UploadedFile $archivo, ?string $altText, int $usuarioId): Media
    {
        $imagen = $this->imageManager->read($archivo->getRealPath());
        $imagen->scaleDown(width: self::ANCHO_MAXIMO);

        $nombreArchivo = Str::uuid()->toString().'.webp';
        $ruta = "media/{$nombreArchivo}";

        $codificada = $imagen->toWebp(self::CALIDAD_WEBP);
        Storage::disk('public')->put($ruta, (string) $codificada);

        return Media::create([
            'url' => Storage::disk('public')->url($ruta),
            'tipo' => 'imagen',
            'alt_text' => $altText,
            'tamano_bytes' => Storage::disk('public')->size($ruta),
            'ancho' => $imagen->width(),
            'alto' => $imagen->height(),
            'subido_por' => $usuarioId,
        ]);
    }

    public function eliminar(Media $media): void
    {
        $ruta = str_replace(Storage::disk('public')->url(''), '', $media->url);
        Storage::disk('public')->delete($ruta);
        $media->delete();
    }
}
