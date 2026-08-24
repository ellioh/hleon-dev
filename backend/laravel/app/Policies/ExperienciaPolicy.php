<?php

namespace App\Policies;

use App\Models\Experiencia;
use App\Models\User;

class ExperienciaPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Experiencia $experiencia): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Experiencia $experiencia): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Experiencia $experiencia): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Experiencia $experiencia): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
