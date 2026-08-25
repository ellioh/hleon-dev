<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma única - sin split lista/detalle (sin campos pesados, ver ADR de Certificaciones). */
class CertificacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'emisor' => $this->emisor,
            'fechaObtencion' => $this->fecha_obtencion?->toDateString(),
            'fechaExpiracion' => $this->fecha_expiracion?->toDateString(),
            'credencialId' => $this->credencial_id,
            'urlVerificacion' => $this->url_verificacion,
            'imagenInsignia' => MediaResource::make($this->whenLoaded('imagenInsignia')),
            'destacado' => $this->destacado,
            'visible' => $this->visible,
            'orden' => $this->orden,
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
