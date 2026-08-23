<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Taxonomía única compartida por Proyecto, Post y Servicio - reemplaza
 * las dos listas de categoría divergentes del sistema JSON anterior.
 */
class Categoria extends Model
{
    protected $table = 'categorias';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'nombre',
        'slug',
        'tipo',
        'descripcion',
        'orden',
    ];

    public function proyectos()
    {
        return $this->hasMany(Proyecto::class, 'categoria_id');
    }
}
