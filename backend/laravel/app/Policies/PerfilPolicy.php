<?php

namespace App\Policies;

use App\Models\User;

/** Singleton: solo hace falta la habilidad "update" (view no está gateado, lo resuelve el controller). */
class PerfilPolicy
{
    public function update(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
