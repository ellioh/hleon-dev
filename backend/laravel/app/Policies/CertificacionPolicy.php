<?php

namespace App\Policies;

use App\Models\Certificacion;
use App\Models\User;

class CertificacionPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Certificacion $certificacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Certificacion $certificacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Certificacion $certificacion): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Certificacion $certificacion): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
