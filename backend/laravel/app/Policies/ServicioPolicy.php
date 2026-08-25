<?php

namespace App\Policies;

use App\Models\Servicio;
use App\Models\User;

class ServicioPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Servicio $servicio): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Servicio $servicio): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Servicio $servicio): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Servicio $servicio): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
