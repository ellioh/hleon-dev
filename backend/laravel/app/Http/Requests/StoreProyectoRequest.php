<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use App\Models\Proyecto;
use Illuminate\Foundation\Http\FormRequest;

class StoreProyectoRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Proyecto::class) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'nombre' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'resumen_ejecutivo' => ['required', 'string', 'max:220'],
            'organizacion_id' => ['nullable', 'integer', 'exists:organizaciones,id'],
            'es_confidencial' => ['boolean'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'estado' => ['required', 'in:en_curso,completado,mantenimiento,archivado'],
            'modalidad' => ['required', 'in:remoto,presencial,hibrido'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after:fecha_inicio'],
            'el_desafio' => ['required', 'string'],
            'la_solucion' => ['required', 'string'],
            'mi_rol' => ['required', 'string'],
            'arquitectura' => ['nullable', 'string'],
            'retos' => ['nullable', 'string'],
            'aprendizajes' => ['nullable', 'string'],
            'imagen_principal_id' => ['nullable', 'integer', 'exists:media,id'],
            'url_publica' => ['nullable', 'string', 'max:255', 'url'],
            'destacado' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'visible' => ['boolean'],
            'tecnologia_ids' => ['required', 'array', 'min:1'],
            'tecnologia_ids.*' => ['integer', 'exists:tecnologias,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tecnologia_ids.required' => 'Selecciona al menos una tecnología.',
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ];
    }
}
