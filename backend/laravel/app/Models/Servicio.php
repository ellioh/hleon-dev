<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Cuarto módulo sobre la arquitectura de referencia de Proyecto (ver ADR
 * 0006). A diferencia de Proyecto/Experiencia/Post, no tiene
 * estado_publicacion/publicado - solo `visible` (booleano simple, sin
 * flujo de borrador/publicado, ver ADR de Servicios). Sí tiene página
 * propia por slug y SEO polimórfico, como Proyecto.
 */
class Servicio extends Model
{
    use SoftDeletes;

    protected $table = 'servicios';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'nombre',
        'slug',
        'icono_emoji',
        'resumen_breve',
        'descripcion_completa',
        'rango_precio_min',
        'rango_precio_max',
        'moneda',
        'tiempo_estimado',
        'proyecto_ejemplo_id',
        'categoria_id',
        'visible',
        'destacado',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'rango_precio_min' => 'decimal:2',
            'rango_precio_max' => 'decimal:2',
            'visible' => 'boolean',
            'destacado' => 'boolean',
        ];
    }

    // --- Relaciones ---

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function proyectoEjemplo()
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_ejemplo_id');
    }

    public function entregables()
    {
        return $this->hasMany(ServicioEntregable::class)->orderBy('orden');
    }

    public function seo()
    {
        return $this->morphOne(Seo::class, 'seo_optionable');
    }

    // --- Scopes ---

    public function scopeVisibles(Builder $query): Builder
    {
        return $query->where('visible', true);
    }
}
