<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('experiencia')) ?? false;
    }

    public function rules(): array
    {
        return [
            'organizacion_id' => ['sometimes', 'integer', 'exists:organizaciones,id'],
            'rol' => ['sometimes', 'string', 'max:120'],
            'modalidad' => ['sometimes', 'in:remoto,presencial,hibrido,freelance'],
            'fecha_inicio' => ['sometimes', 'date'],
            'fecha_fin' => ['sometimes', 'nullable', 'date', 'after:fecha_inicio', 'prohibited_if:actual,true'],
            'actual' => ['sometimes', 'boolean'],
            'resumen' => ['sometimes', 'string', 'max:300'],
            'descripcion' => ['sometimes', 'string'],
            'ubicacion' => ['sometimes', 'nullable', 'string', 'max:120'],
            'destacado' => ['sometimes', 'boolean'],
            'orden' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'visible' => ['sometimes', 'boolean'],
            'tecnologia_ids' => ['sometimes', 'array'],
            'tecnologia_ids.*' => ['integer', 'exists:tecnologias,id'],
            'proyecto_ids' => ['sometimes', 'array'],
            'proyecto_ids.*' => ['integer', 'exists:proyectos,id'],
            'logros' => ['sometimes', 'array'],
            'logros.*' => ['string', 'max:300'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio.',
            'fecha_fin.prohibited_if' => 'Una experiencia marcada como "actual" no puede tener fecha de fin.',
        ];
    }
}
