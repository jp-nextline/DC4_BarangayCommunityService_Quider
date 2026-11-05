<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route is protected by role:admin
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['approved', 'rejected', 'completed'])],
            'remarks' => ['nullable', 'string', 'max:500', 'required_if:status,rejected'],
        ];
    }

    public function messages(): array
    {
        return ['remarks.required_if' => 'Please give the resident a reason for rejecting the request.'];
    }
}
