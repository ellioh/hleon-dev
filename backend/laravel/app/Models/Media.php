<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Biblioteca única de archivos - reutilizada por cualquier módulo que
 * necesite una imagen/PDF (imagen principal directa, o a través de
 * `media_galeria` para galerías 1-N). Ver ADR 0006.
 */
class Media extends Model
{
    protected $table = 'media';

    public $timestamps = false;

    protected $fillable = [
        'url',
        'tipo',
        'alt_text',
        'tamano_bytes',
        'ancho',
        'alto',
        'subido_por',
    ];

    protected function casts(): array
    {
        return [
            'tamano_bytes' => 'integer',
            'ancho' => 'integer',
            'alto' => 'integer',
            'subido_en' => 'datetime',
        ];
    }

    public function subidoPor()
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
}
