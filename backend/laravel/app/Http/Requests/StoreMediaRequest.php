<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->activo && in_array($this->user()->rol, ['admin', 'editor'], true);
    }

    public function rules(): array
    {
        return [
            'archivo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:8192'], // 8MB
            'alt_text' => ['nullable', 'string', 'max:200'],
        ];
    }
}
