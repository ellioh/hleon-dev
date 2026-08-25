<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Singleton: fuente única de identidad/disponibilidad, consumida como
 * autor de Post. La fila única se garantiza a nivel de aplicación
 * (PerfilService::obtenerOCrear), no con una restricción de base de datos
 * (ver comentario original de la migración).
 */
class Perfil extends Model
{
    protected $table = 'perfil';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'nombre_completo',
        'nombre_publico',
        'titulo_profesional',
        'titulo_profesional_en',
        'bio_corta',
        'bio_larga',
        'bio_larga_en',
        'foto_media_id',
        'email',
        'ubicacion',
        'nivel_ingles',
        'disponibilidad',
        'mensaje_disponibilidad',
        'anos_experiencia',
        'cv_general_id',
    ];

    protected function casts(): array
    {
        return [
            'anos_experiencia' => 'integer',
        ];
    }

    public function foto()
    {
        return $this->belongsTo(Media::class, 'foto_media_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'autor_id');
    }
}
