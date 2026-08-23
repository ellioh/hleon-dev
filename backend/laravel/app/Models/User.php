<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Se mantiene el nombre de clase `User` por convención de Laravel/Sanctum
 * (es lo que `Auth::user()` y `$request->user()` esperan por defecto),
 * pero la tabla es `usuarios` - el esquema en español ya aprobado en el
 * documento de diseño del CMS, portado de packages/db en la Iteración 1.
 *
 * Hoy solo existe un administrador; `rol` ya contempla `editor` para no
 * requerir una migración de auth cuando haga falta un segundo usuario o
 * el futuro panel de clientes (ver documento de escalabilidad del CMS).
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'email',
        'password_hash',
        'rol',
        'activo',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'ultimo_acceso' => 'datetime',
        ];
    }

    /**
     * Laravel busca `password` para el guard de auth por convención;
     * la columna real es `password_hash` (mismo nombre que en el
     * esquema de Iteración 1). Este accessor evita duplicar la columna.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    public function getCreatedAtColumn(): ?string
    {
        return 'creado_en';
    }

    public function getUpdatedAtColumn(): ?string
    {
        return null; // `usuarios` no tiene actualizado_en en el esquema aprobado
    }
}
