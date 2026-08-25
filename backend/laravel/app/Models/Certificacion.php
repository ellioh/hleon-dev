<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Quinto módulo sobre la arquitectura de referencia de Proyecto (ver ADR
 * 0006). El más simple hasta ahora: sin categoría, sin SEO, sin slug ni
 * página propia (insumo de /trayectoria, igual que Experiencia - ver ADR
 * 0007), sin estado_publicacion (solo `visible`, igual que Servicio - ver
 * ADR 0009).
 */
class Certificacion extends Model
{
    use SoftDeletes;

    protected $table = 'certificaciones';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = null;

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'nombre',
        'emisor',
        'fecha_obtencion',
        'fecha_expiracion',
        'credencial_id',
        'url_verificacion',
        'imagen_insignia_id',
        'destacado',
        'visible',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'fecha_obtencion' => 'date',
            'fecha_expiracion' => 'date',
            'destacado' => 'boolean',
            'visible' => 'boolean',
        ];
    }

    // --- Relaciones ---

    public function imagenInsignia()
    {
        return $this->belongsTo(Media::class, 'imagen_insignia_id');
    }

    // --- Scopes ---

    public function scopeVisibles(Builder $query): Builder
    {
        return $query->where('visible', true);
    }
}
