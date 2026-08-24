<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerfilResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombreCompleto' => $this->nombre_completo,
            'nombrePublico' => $this->nombre_publico,
            'tituloProfesional' => $this->titulo_profesional,
            'bioCorta' => $this->bio_corta,
            'bioLarga' => $this->bio_larga,
            'foto' => MediaResource::make($this->whenLoaded('foto')),
            'email' => $this->email,
            'ubicacion' => $this->ubicacion,
            'nivelIngles' => $this->nivel_ingles,
            'disponibilidad' => $this->disponibilidad,
            'mensajeDisponibilidad' => $this->mensaje_disponibilidad,
            'anosExperiencia' => $this->anos_experiencia,
            'cvGeneralId' => $this->cv_general_id,
            'actualizadoEn' => $this->actualizado_en?->toIso8601String(),
        ];
    }
}
