<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['nullable', 'string', 'max:50', 'unique:employees,employee_id'],
            'firstname' => ['required', 'string', 'max:100'],
            'lastname' => ['required', 'string', 'max:100'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'education_qualification' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:1000'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email'],
            'phone' => ['required', 'string', 'max:25'],
            'photo' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp,gif', 'max:5120'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'employee_id.unique' => 'This Employee ID is already registered.',
            'email.unique' => 'This email address is already registered.',
            'date_of_birth.before' => 'Date of birth must be a past date.',
            'photo.mimes' => 'Photo must be an image (JPEG, PNG, JPG, WEBP, or GIF).',
            'photo.max' => 'Photo file size must not exceed 5MB.',
            'resume.mimes' => 'Resume must be a PDF or Word document (PDF, DOC, DOCX).',
            'resume.max' => 'Resume file size must not exceed 10MB.',
        ];
    }
}

