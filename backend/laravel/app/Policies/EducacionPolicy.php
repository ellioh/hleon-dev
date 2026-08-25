<?php

namespace App\Policies;

use App\Models\Educacion;
use App\Models\User;

class EducacionPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Educacion $educacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Educacion $educacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Educacion $educacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Educacion $educacion): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
