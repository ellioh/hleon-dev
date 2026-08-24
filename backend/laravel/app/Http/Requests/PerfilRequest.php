<?php

namespace App\Http\Requests;

use App\Models\Perfil;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Una sola clase para crear y actualizar (a diferencia de Proyecto/
 * Experiencia): el formulario de "Mi perfil" es un único formulario que
 * siempre envía todos los campos, no hay actualización parcial real.
 */
class PerfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', Perfil::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => ['required', 'string', 'max:160'],
            'nombre_publico' => ['nullable', 'string', 'max:160'],
            'titulo_profesional' => ['required', 'string', 'max:160'],
            'bio_corta' => ['required', 'string', 'max:200'],
            'bio_larga' => ['required', 'string'],
            'foto_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'email' => ['required', 'email', 'max:190'],
            'ubicacion' => ['required', 'string', 'max:120'],
            'nivel_ingles' => ['required', 'in:basico,intermedio,avanzado,profesional,nativo'],
            'disponibilidad' => ['required', 'in:abierto_remoto,abierto_proyectos,abierto_ambos,no_disponible'],
            'mensaje_disponibilidad' => ['nullable', 'string', 'max:200'],
            'anos_experiencia' => ['required', 'integer', 'min:0'],
            'cv_general_id' => ['nullable', 'integer', 'exists:descargas,id'],
        ];
    }
}
