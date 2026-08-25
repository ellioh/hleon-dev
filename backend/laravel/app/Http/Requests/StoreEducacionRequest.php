<?php

namespace App\Http\Requests;

use App\Models\Educacion;
use Illuminate\Foundation\Http\FormRequest;

class StoreEducacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Educacion::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'institucion' => ['required', 'string', 'max:160'],
            'titulo' => ['required', 'string', 'max:160'],
            'titulo_en' => ['nullable', 'string', 'max:160'],
            'campo_estudio' => ['nullable', 'string', 'max:120'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['nullable', 'date', 'prohibited_if:en_curso,true'],
            'en_curso' => ['boolean'],
            'descripcion' => ['nullable', 'string'],
            'visible' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_fin.prohibited_if' => 'Un estudio marcado como "en curso" no puede tener fecha de fin.',
        ];
    }
}
