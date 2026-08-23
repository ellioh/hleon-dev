<?php

namespace App\Http\Requests\Concerns;

/**
 * Reglas de validación del bloque SEO (seo_metadata polimórfica) -
 * compartidas por cualquier Form Request de contenido público (Proyecto
 * ahora; Post/Servicio después) para no repetir estas ~12 reglas por
 * módulo. Ver ADR 0006.
 */
trait ValidatesSeo
{
    protected function reglasSeo(string $prefijo = 'seo'): array
    {
        return [
            $prefijo => ['sometimes', 'array'],
            "{$prefijo}.meta_titulo" => ['nullable', 'string', 'max:160'],
            "{$prefijo}.meta_descripcion" => ['nullable', 'string', 'max:160'],
            "{$prefijo}.canonical_url" => ['nullable', 'string', 'max:255', 'url'],
            "{$prefijo}.robots_index" => ['boolean'],
            "{$prefijo}.robots_follow" => ['boolean'],
            "{$prefijo}.og_titulo" => ['nullable', 'string', 'max:160'],
            "{$prefijo}.og_descripcion" => ['nullable', 'string', 'max:200'],
            "{$prefijo}.og_imagen_id" => ['nullable', 'integer', 'exists:media,id'],
            "{$prefijo}.og_tipo" => ['nullable', 'string', 'max:40'],
            "{$prefijo}.twitter_card" => ['nullable', 'in:summary,summary_large_image'],
            "{$prefijo}.twitter_titulo" => ['nullable', 'string', 'max:160'],
            "{$prefijo}.twitter_descripcion" => ['nullable', 'string', 'max:200'],
            "{$prefijo}.twitter_imagen_id" => ['nullable', 'integer', 'exists:media,id'],
        ];
    }
}
