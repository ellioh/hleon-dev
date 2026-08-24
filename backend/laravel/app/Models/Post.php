<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Tercer módulo sobre la arquitectura de referencia de Proyecto (ver ADR
 * 0006/0007). A diferencia de Experiencia, sí tiene página propia por
 * entrada (slug) y SEO polimórfico - más parecido a Proyecto que a
 * Experiencia en ese sentido. `autor_id` referencia el Perfil singleton,
 * no un string ni el usuario admin.
 */
class Post extends Model
{
    use SoftDeletes;

    protected $table = 'posts';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'fecha_actualizacion';

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'titulo',
        'slug',
        'resumen',
        'contenido',
        'categoria_id',
        'tipo_audiencia',
        'tags',
        'imagen_destacada_id',
        'autor_id',
        'publicado',
        'fecha_publicacion',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'publicado' => 'boolean',
            'fecha_publicacion' => 'datetime',
        ];
    }

    // --- Relaciones ---

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function autor()
    {
        return $this->belongsTo(Perfil::class, 'autor_id');
    }

    public function imagenDestacada()
    {
        return $this->belongsTo(Media::class, 'imagen_destacada_id');
    }

    public function seo()
    {
        return $this->morphOne(Seo::class, 'seo_optionable');
    }

    // --- Scopes ---

    public function scopePublicados(Builder $query): Builder
    {
        return $query->where('publicado', true)->where('fecha_publicacion', '<=', now());
    }
}
