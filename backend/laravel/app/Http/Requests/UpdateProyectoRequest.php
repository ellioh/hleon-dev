<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProyectoRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('proyecto')) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'nombre' => ['sometimes', 'string', 'max:160'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'resumen_ejecutivo' => ['sometimes', 'string', 'max:220'],
            'organizacion_id' => ['sometimes', 'nullable', 'integer', 'exists:organizaciones,id'],
            'es_confidencial' => ['sometimes', 'boolean'],
            'categoria_id' => ['sometimes', 'integer', 'exists:categorias,id'],
            'estado' => ['sometimes', 'in:en_curso,completado,mantenimiento,archivado'],
            'modalidad' => ['sometimes', 'in:remoto,presencial,hibrido'],
            'fecha_inicio' => ['sometimes', 'date'],
            'fecha_fin' => ['sometimes', 'nullable', 'date', 'after:fecha_inicio'],
            'el_desafio' => ['sometimes', 'string'],
            'la_solucion' => ['sometimes', 'string'],
            'mi_rol' => ['sometimes', 'string'],
            'arquitectura' => ['sometimes', 'nullable', 'string'],
            'retos' => ['sometimes', 'nullable', 'string'],
            'aprendizajes' => ['sometimes', 'nullable', 'string'],
            'imagen_principal_id' => ['sometimes', 'nullable', 'integer', 'exists:media,id'],
            'url_publica' => ['sometimes', 'nullable', 'string', 'max:255', 'url'],
            'destacado' => ['sometimes', 'boolean'],
            'orden' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'visible' => ['sometimes', 'boolean'],
            'tecnologia_ids' => ['sometimes', 'array', 'min:1'],
            'tecnologia_ids.*' => ['integer', 'exists:tecnologias,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tecnologia_ids.min' => 'Un proyecto debe tener al menos una tecnología asociada.',
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ];
    }
}
