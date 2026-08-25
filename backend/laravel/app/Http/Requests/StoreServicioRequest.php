<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesSeo;
use App\Models\Servicio;
use Illuminate\Foundation\Http\FormRequest;

class StoreServicioRequest extends FormRequest
{
    use ValidatesSeo;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Servicio::class) ?? false;
    }

    public function rules(): array
    {
        return [
            ...$this->reglasSeo(),
            'nombre' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'icono_emoji' => ['nullable', 'string', 'max:10'],
            'resumen_breve' => ['required', 'string', 'max:150'],
            'descripcion_completa' => ['required', 'string'],
            'rango_precio_min' => ['nullable', 'numeric', 'min:0'],
            'rango_precio_max' => ['nullable', 'numeric', 'min:0', 'gte:rango_precio_min'],
            'moneda' => ['nullable', 'in:USD,PEN', 'required_with:rango_precio_min,rango_precio_max'],
            'tiempo_estimado' => ['nullable', 'string', 'max:60'],
            'proyecto_ejemplo_id' => ['nullable', 'integer', 'exists:proyectos,id'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'visible' => ['boolean'],
            'destacado' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'entregables' => ['nullable', 'array'],
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
