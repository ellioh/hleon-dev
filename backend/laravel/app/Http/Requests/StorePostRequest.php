<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Sin `autor_id`: se resuelve del lado del servidor a partir del Perfil
 * singleton (ver PostService::crear) - con un solo autor posible en todo
 * el sistema, no tiene sentido pedirlo en el formulario.
 */
class StorePostRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Post::class) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'titulo' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'resumen' => ['required', 'string', 'max:300'],
            'contenido' => ['required', 'string'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'tipo_audiencia' => ['required', 'in:consultoria,carrera_arquitectura,ambos'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
            'imagen_destacada_id' => ['nullable', 'integer', 'exists:media,id'],
            'fecha_publicacion' => ['nullable', 'date'],
        ];
    }
}
