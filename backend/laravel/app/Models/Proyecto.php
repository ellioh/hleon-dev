<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * El case study completo - arquitectura de referencia del resto del CMS
 * (ver ADR 0006). `elDesafio`/`laSolucion`/`miRol` obligatorios a
 * propósito: el formulario enseña la estructura narrativa correcta.
 *
 * Patrones aquí pensados para reutilizarse en Experience/Post/Servicio:
 * Organizacion compartida, Media (imagen directa + galería/video
 * polimórficos), Seo polimórfico, soft delete + estado_publicacion.
 */
class Proyecto extends Model
{
    use SoftDeletes;

    protected $table = 'proyectos';

    const CREATED_AT = 'creado_en';

    const UPDATED_AT = 'actualizado_en';

    const DELETED_AT = 'eliminado_en';

    protected $fillable = [
        'nombre',
        'slug',
        'resumen_ejecutivo',
        'organizacion_id',
        'es_confidencial',
        'categoria_id',
        'estado',
        'modalidad',
        'fecha_inicio',
        'fecha_fin',
        'el_desafio',
        'la_solucion',
        'mi_rol',
        'arquitectura',
        'retos',
        'aprendizajes',
        'imagen_principal_id',
        'url_publica',
        'destacado',
        'orden',
        'visible',
        'estado_publicacion',
    ];

    protected function casts(): array
    {
        return [
            'es_confidencial' => 'boolean',
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

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenPrincipal()
    {
        return $this->belongsTo(Media::class, 'imagen_principal_id');
    }

    public function resultados()
    {
        return $this->hasMany(ProyectoResultado::class)->orderBy('orden');
    }

    public function tecnologias()
    {
        return $this->belongsToMany(Tecnologia::class, 'proyecto_tecnologia');
    }

    /** Galería ordenada - reutiliza la tabla polimórfica media_galeria. */
    public function galeria()
    {
        return $this->morphToMany(Media::class, 'galeriable', 'media_galeria')
            ->withPivot('orden')
            ->orderBy('media_galeria.orden');
    }

    public function videos()
    {
        return $this->morphMany(VideoEmbebido::class, 'embebible')->orderBy('orden');
    }

    public function seo()
    {
        return $this->morphOne(Seo::class, 'seo_optionable');
    }

    // testimonios(): se agrega cuando se implemente el módulo Testimonios
    // (la FK testimonios.proyecto_id ya existe desde la Fase 1).

    /**
     * `proyecto_relacionado` guarda un solo par no dirigido por fila
     * (proyecto_id < relacionado_id) - por eso hacen falta dos relaciones
     * combinadas para recorrer el vínculo en cualquier sentido.
     */
    public function relacionadosComoMenor()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_relacionado', 'proyecto_id', 'relacionado_id');
    }

    public function relacionadosComoMayor()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_relacionado', 'relacionado_id', 'proyecto_id');
    }

    public function relacionados()
    {
        return $this->relacionadosComoMenor->merge($this->relacionadosComoMayor);
    }

    // --- Scopes ---

    public function scopePublicados(Builder $query): Builder
    {
        return $query->where('estado_publicacion', 'publicado')->where('visible', true);
    }

    public function scopeDestacados(Builder $query): Builder
    {
        return $query->where('destacado', true);
    }
}
