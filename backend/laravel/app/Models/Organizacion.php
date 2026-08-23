<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Reemplaza "Cliente": una organización puede ser cliente de consultoría,
 * empleador (uso futuro en Experiencia vía `tipo`), o ambos. La
 * confidencialidad es una decisión por Proyecto (`es_confidencial`), no
 * una propiedad de la organización - ver migración 000005 y ADR 0006.
 */
class Organizacion extends Model
{
    protected $table = 'organizaciones';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'nombre_publico',
        'tipo',
        'logo_media_id',
        'url',
        'rubro',
        'destacado',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'destacado' => 'boolean',
            'creado_en' => 'datetime',
        ];
    }

    public function logo()
    {
        return $this->belongsTo(Media::class, 'logo_media_id');
    }

    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'organizacion_id');
    }

    /** Nombre a mostrar cuando el proyecto/testimonio NO es confidencial. */
    public function getNombreVisibleAttribute(): string
    {
        return $this->nombre_publico ?: $this->nombre;
    }
}
