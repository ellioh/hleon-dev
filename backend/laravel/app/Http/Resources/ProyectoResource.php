<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Forma "detalle" completa - incluye la narrativa del case study
 * (el_desafio/la_solucion/mi_rol/resultados) que la tarjeta de listado
 * omite. Patrón de referencia para PostResource/ServicioResource futuros.
 */
class ProyectoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'resumenEjecutivo' => $this->resumen_ejecutivo,
            'organizacion' => OrganizacionResource::make($this->whenLoaded('organizacion')),
            'esConfidencial' => $this->es_confidencial,
            'categoria' => CategoriaResource::make($this->whenLoaded('categoria')),
            'estado' => $this->estado,
            'modalidad' => $this->modalidad,
            'fechaInicio' => $this->fecha_inicio?->toDateString(),
            'fechaFin' => $this->fecha_fin?->toDateString(),
            'elDesafio' => $this->el_desafio,
            'laSolucion' => $this->la_solucion,
            'miRol' => $this->mi_rol,
            'arquitectura' => $this->arquitectura,
            'retos' => $this->retos,
            'aprendizajes' => $this->aprendizajes,
            'imagenPrincipal' => MediaResource::make($this->whenLoaded('imagenPrincipal')),
            'urlPublica' => $this->url_publica,
            'galeria' => MediaResource::collection($this->whenLoaded('galeria')),
            'videos' => $this->whenLoaded('videos', fn () => $this->videos->map(fn ($v) => [
                'id' => $v->id,
                'url' => $v->url,
                'titulo' => $v->titulo,
                'orden' => $v->orden,
            ])),
            'resultados' => $this->whenLoaded('resultados', fn () => $this->resultados->map(fn ($r) => [
                'id' => $r->id,
                'metrica' => $r->metrica,
                'valor' => $r->valor,
                'descripcion' => $r->descripcion,
                'orden' => $r->orden,
            ])),
            'tecnologias' => TecnologiaResource::collection($this->whenLoaded('tecnologias')),
            'seo' => SeoResource::make($this->whenLoaded('seo')),
            'destacado' => $this->destacado,
            'orden' => $this->orden,
            'visible' => $this->visible,
            'estadoPublicacion' => $this->estado_publicacion,
            'creadoEn' => $this->creado_en?->toIso8601String(),
            'actualizadoEn' => $this->actualizado_en?->toIso8601String(),
            'eliminadoEn' => $this->eliminado_en?->toIso8601String(),
        ];
    }
}
