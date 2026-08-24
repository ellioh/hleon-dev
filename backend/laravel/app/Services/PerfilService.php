<?php

namespace App\Services;

use App\Models\Perfil;

/**
 * Sin PerfilRepository: es una sola fila con un solo caso de uso
 * (obtener/guardar), no hay query compleja que justifique separar una
 * capa de repositorio como en Proyecto/Post/Experiencia.
 */
class PerfilService
{
    /** Null si el usuario todavía no cargó su perfil real - nunca se fabrica una fila con datos de relleno. */
    public function obtener(): ?Perfil
    {
        return Perfil::first();
    }

    /** Crea la fila la primera vez, actualiza la única fila existente después. */
    public function guardar(array $datos): Perfil
    {
        $perfil = Perfil::first();

        if ($perfil) {
            $perfil->update($datos);

            return $perfil->fresh();
        }

        return Perfil::create($datos);
    }
}
