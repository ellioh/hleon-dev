<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function view(User $user, Post $post): bool
    {
        return $this->esGestorActivo($user);
    }

    public function create(User $user): bool
    {
        return $this->esGestorActivo($user);
    }

    public function update(User $user, Post $post): bool
    {
        return $this->esGestorActivo($user);
    }

    public function delete(User $user, Post $post): bool
    {
        return $this->esGestorActivo($user);
    }

    public function restore(User $user, Post $post): bool
    {
        return $this->esGestorActivo($user);
    }

    private function esGestorActivo(User $user): bool
    {
        return $user->activo && in_array($user->rol, ['admin', 'editor'], true);
    }
}
