<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Línea de tiempo laboral - insumo de /trayectoria. A diferencia de
 * Proyecto (ver ADR 0006), no tiene página propia por entrada: sin slug,
 * sin SEO polimórfico, sin galería de Media.
 */
class Experiencia extends Model
{
    use SoftDeletes;

    protected $table = 'experiencias';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'organizacion_id',
        'rol',
        'modalidad',
        'fecha_inicio',
        'fecha_fin',
        'actual',
        'resumen',
        'descripcion',
        'ubicacion',
        'destacado',
        'orden',
        'visible',
        'estado_publicacion',
    ];

    protected function casts(): array
    {
        return [
            'actual' => 'boolean',
            'destacado' => 'boolean',
            'visible' => 'boolean',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
        ];
    }

    // --- Relaciones ---

    public function organizacion()
    {
        return $this->belongsTo(Organizacion::class);
    }

    public function logros()
    {
        return $this->hasMany(ExperienciaLogro::class)->orderBy('orden');
    }

    public function tecnologias()
    {
        return $this->belongsToMany(Tecnologia::class, 'experiencia_tecnologia');
    }

    /** Proyectos del portafolio realizados durante esta experiencia. */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'experiencia_proyecto');
    }

    // --- Scopes ---

    public function scopePublicadas(Builder $query): Builder
    {
        return $query->where('estado_publicacion', 'publicado')->where('visible', true);
    }
}
