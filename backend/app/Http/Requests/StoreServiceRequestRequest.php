<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** Used for both create and update of a service request. */
class StoreServiceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ownership/role is enforced by ServiceRequestPolicy
    }

    public function rules(): array
    {
        return [
            'service_category_id' => ['required', 'integer', 'exists:service_categories,id'],
            'title' => ['required', 'string', 'min:5', 'max:150'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'service_category_id.required' => 'Please choose a category.',
            'service_category_id.exists' => 'The selected category does not exist.',
        ];
    }
}
