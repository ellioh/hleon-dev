<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperienciaLogro extends Model
{
    public $timestamps = false;

    protected $table = 'experiencia_logros';

    protected $fillable = [
        'experiencia_id',
        'texto',
        'orden',
    ];

    public function experiencia()
    {
        return $this->belongsTo(Experiencia::class);
    }
}
