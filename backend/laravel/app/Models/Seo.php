<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SEO polimórfico: un solo modelo para meta título/descripción,
 * canonical, indexación (robots), Open Graph y Twitter Cards. Cualquier
 * módulo de contenido público (Proyecto, y luego Post/Servicio) usa
 * `morphOne(Seo::class, 'seoOptionable')`. Ver ADR 0006.
 */
class Seo extends Model
{
    protected $table = 'seo_metadata';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'meta_titulo',
        'meta_descripcion',
        'canonical_url',
        'robots_index',
        'robots_follow',
        'og_titulo',
        'og_descripcion',
        'og_imagen_id',
        'og_tipo',
        'twitter_card',
        'twitter_titulo',
        'twitter_descripcion',
        'twitter_imagen_id',
    ];

    protected function casts(): array
    {
        return [
            'robots_index' => 'boolean',
            'robots_follow' => 'boolean',
        ];
    }

    public function seoOptionable()
    {
        // Nombre explícito: las columnas son snake_case
        // (seo_optionable_type/_id); sin esto Laravel infiere
        // "seoOptionable_type" del nombre del método y falla.
        return $this->morphTo('seo_optionable');
    }

    public function ogImagen()
    {
        return $this->belongsTo(Media::class, 'og_imagen_id');
    }

    public function twitterImagen()
    {
        return $this->belongsTo(Media::class, 'twitter_imagen_id');
    }
}
