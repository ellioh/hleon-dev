<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Entidad completa (no una relación textual): nombre, slug, logo real,
 * categoría, color, sitio web. Responde "con qué construyes", distinto
 * de Habilidad ("qué sabes analizar/liderar").
 */
class Tecnologia extends Model
{
    protected $table = 'tecnologias';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'slug',
        'categoria',
        'icono',
        'logo_media_id',
        'color_acento',
        'url',
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
        return $this->belongsToMany(Proyecto::class, 'proyecto_tecnologia');
    }
}
