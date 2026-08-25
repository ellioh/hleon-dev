<?php

namespace App\Http\Requests;

use App\Models\Certificacion;
use Illuminate\Foundation\Http\FormRequest;

class StoreCertificacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Certificacion::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:160'],
            'emisor' => ['required', 'string', 'max:120'],
            'fecha_obtencion' => ['required', 'date'],
            'fecha_expiracion' => ['nullable', 'date', 'after:fecha_obtencion'],
            'credencial_id' => ['nullable', 'string', 'max:120'],
            'url_verificacion' => ['nullable', 'string', 'max:255', 'url'],
            'imagen_insignia_id' => ['nullable', 'integer', 'exists:media,id'],
            'destacado' => ['boolean'],
            'visible' => ['boolean'],
            'orden' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_expiracion.after' => 'La fecha de expiración debe ser posterior a la fecha de obtención.',
        ];
    }
}
