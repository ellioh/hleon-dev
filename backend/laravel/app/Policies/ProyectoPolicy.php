<?php

namespace App\Policies;

use App\Models\Proyecto;
use App\Models\User;

/**
 * Lectura pública no pasa por policy (el controller público no la
 * invoca). Escritura exige `activo=true` y rol admin/editor - hoy solo
 * existe un admin, pero el chequeo por rol ya deja listo el camino para
 * un segundo usuario editor sin tocar esta clase.
 */
class ProyectoPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Proyecto $proyecto): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Proyecto $proyecto): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Proyecto $proyecto): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Proyecto $proyecto): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
