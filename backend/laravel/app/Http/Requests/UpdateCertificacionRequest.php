<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('certificacion')) ?? false;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'string', 'max:160'],
            'emisor' => ['sometimes', 'string', 'max:120'],
            'fecha_obtencion' => ['sometimes', 'date'],
            'fecha_expiracion' => ['sometimes', 'nullable', 'date', 'after:fecha_obtencion'],
            'credencial_id' => ['sometimes', 'nullable', 'string', 'max:120'],
            'url_verificacion' => ['sometimes', 'nullable', 'string', 'max:255', 'url'],
            'imagen_insignia_id' => ['sometimes', 'nullable', 'integer', 'exists:media,id'],
            'destacado' => ['sometimes', 'boolean'],
            'visible' => ['sometimes', 'boolean'],
            'orden' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_expiracion.after' => 'La fecha de expiración debe ser posterior a la fecha de obtención.',
        ];
    }
}
