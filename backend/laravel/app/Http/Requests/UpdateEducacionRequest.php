<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('educacion')) ?? false;
    }

    public function rules(): array
    {
        return [
            'institucion' => ['sometimes', 'string', 'max:160'],
            'titulo' => ['sometimes', 'string', 'max:160'],
            'titulo_en' => ['sometimes', 'nullable', 'string', 'max:160'],
            'campo_estudio' => ['sometimes', 'nullable', 'string', 'max:120'],
            'fecha_inicio' => ['sometimes', 'date'],
            'fecha_fin' => ['sometimes', 'nullable', 'date', 'prohibited_if:en_curso,true'],
            'en_curso' => ['sometimes', 'boolean'],
            'descripcion' => ['sometimes', 'nullable', 'string'],
            'visible' => ['sometimes', 'boolean'],
            'orden' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_fin.prohibited_if' => 'Un estudio marcado como "en curso" no puede tener fecha de fin.',
        ];
    }
}
