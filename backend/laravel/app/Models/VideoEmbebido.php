<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Video embebido (YouTube/Loom - no un archivo subido, por eso no usa
 * Media). Polimórfico para que Blog/Servicios lo reutilicen sin tabla
 * nueva. Ver ADR 0006.
 */
class VideoEmbebido extends Model
{
    protected $table = 'videos_embebidos';

    public $timestamps = false;

    protected $fillable = [
        'url',
        'titulo',
        'orden',
    ];

    public function embebible()
    {
        return $this->morphTo();
    }
}
