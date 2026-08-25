<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Sexto módulo sobre la arquitectura de referencia de Proyecto (ver ADR
 * 0006). Mismo patrón que Certificacion: sin categoría, SEO, slug ni
 * flujo de publicación (solo `visible`) - insumo de /trayectoria y
 * /hire-me.
 */
class Educacion extends Model
{
    use SoftDeletes;

    protected $table = 'educaciones';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = null;

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'institucion',
        'titulo',
        'titulo_en',
        'campo_estudio',
        'fecha_inicio',
        'fecha_fin',
        'en_curso',
        'descripcion',
        'visible',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'en_curso' => 'boolean',
            'visible' => 'boolean',
        ];
    }

    public function scopeVisibles(Builder $query): Builder
    {
        return $query->where('visible', true);
    }
}
