<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Resultado estructurado {metrica, valor, descripcion} - permite
 * renderizar "stat cards" automáticamente en vez de depender de texto
 * libre. Específico de Proyecto (no se generaliza: a diferencia de
 * media/SEO, no hay hoy un segundo módulo que lo necesite).
 */
class ProyectoResultado extends Model
{
    protected $table = 'proyecto_resultados';

    public $timestamps = false;

    protected $fillable = [
        'proyecto_id',
        'metrica',
        'valor',
        'descripcion',
        'orden',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }
}
