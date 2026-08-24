<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('post')) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'titulo' => ['sometimes', 'string', 'max:180'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:200', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'resumen' => ['sometimes', 'string', 'max:300'],
            'contenido' => ['sometimes', 'string'],
            'categoria_id' => ['sometimes', 'integer', 'exists:categorias,id'],
            'tipo_audiencia' => ['sometimes', 'in:consultoria,carrera_arquitectura,ambos'],
            'tags' => ['sometimes', 'nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
            'imagen_destacada_id' => ['sometimes', 'nullable', 'integer', 'exists:media,id'],
            'fecha_publicacion' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
