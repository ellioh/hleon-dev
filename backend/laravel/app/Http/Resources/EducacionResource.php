<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Forma única - sin split lista/detalle (sin campos pesados, mismo criterio que Certificacion). */
class EducacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institucion' => $this->institucion,
            'titulo' => $this->titulo,
            'tituloEn' => $this->titulo_en,
            'campoEstudio' => $this->campo_estudio,
            'fechaInicio' => $this->fecha_inicio?->toDateString(),
            'fechaFin' => $this->fecha_fin?->toDateString(),
            'enCurso' => $this->en_curso,
            'descripcion' => $this->descripcion,
            'visible' => $this->visible,
            'orden' => $this->orden,
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
