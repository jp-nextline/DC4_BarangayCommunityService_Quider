<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route is protected by role:admin
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 'string', 'max:100',
                Rule::unique('service_categories', 'name')->ignore($this->route('category')),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
