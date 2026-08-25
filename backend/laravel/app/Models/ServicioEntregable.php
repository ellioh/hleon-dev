<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicioEntregable extends Model
{
    public $timestamps = false;

    protected $table = 'servicio_entregables';

    protected $fillable = [
        'servicio_id',
        'texto',
        'orden',
    ];

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }
}
