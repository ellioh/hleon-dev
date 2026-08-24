<?php

namespace App\Http\Requests;

use App\Models\Experiencia;
use Illuminate\Foundation\Http\FormRequest;

class StoreExperienciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Experiencia::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'organizacion_id' => ['required', 'integer', 'exists:organizaciones,id'],
            'rol' => ['required', 'string', 'max:120'],
            'modalidad' => ['required', 'in:remoto,presencial,hibrido,freelance'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after:fecha_inicio', 'prohibited_if:actual,true'],
            'actual' => ['boolean'],
            'resumen' => ['required', 'string', 'max:300'],
            'descripcion' => ['required', 'string'],
            'ubicacion' => ['nullable', 'string', 'max:120'],
            'destacado' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'visible' => ['boolean'],
            'tecnologia_ids' => ['nullable', 'array'],
            'tecnologia_ids.*' => ['integer', 'exists:tecnologias,id'],
            'proyecto_ids' => ['nullable', 'array'],
            'proyecto_ids.*' => ['integer', 'exists:proyectos,id'],
            'logros' => ['nullable', 'array'],
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
