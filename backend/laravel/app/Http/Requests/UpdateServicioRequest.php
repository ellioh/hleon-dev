<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServicioRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('servicio')) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'nombre' => ['sometimes', 'string', 'max:120'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:140', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'icono_emoji' => ['sometimes', 'nullable', 'string', 'max:10'],
            'resumen_breve' => ['sometimes', 'string', 'max:150'],
            'descripcion_completa' => ['sometimes', 'string'],
            'rango_precio_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'rango_precio_max' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:rango_precio_min'],
            'moneda' => ['sometimes', 'nullable', 'in:USD,PEN', 'required_with:rango_precio_min,rango_precio_max'],
            'tiempo_estimado' => ['sometimes', 'nullable', 'string', 'max:60'],
            'proyecto_ejemplo_id' => ['sometimes', 'nullable', 'integer', 'exists:proyectos,id'],
            'categoria_id' => ['sometimes', 'integer', 'exists:categorias,id'],
            'visible' => ['sometimes', 'boolean'],
            'destacado' => ['sometimes', 'boolean'],
            'orden' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'entregables' => ['sometimes', 'nullable', 'array'],
            'entregables.*' => ['string', 'max:200'],
        ];
    }

    public function messages(): array
    {
        return [
            'rango_precio_max.gte' => 'El precio máximo debe ser mayor o igual al precio mínimo.',
            'moneda.required_with' => 'Selecciona la moneda si vas a indicar un rango de precio.',
        ];
    }
}
