<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class ReservaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'habitacion_id' => 'required|exists:habitaciones,id',
            'cliente' => 'required|string|max:255',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
        ];
    }

    public function messages(): array
    {
        return [
            'habitacion_id.required' => 'Debe seleccionar una habitación.',
            'habitacion_id.exists' => 'La habitación seleccionada no existe.',

            'cliente.required' => 'El nombre del cliente es obligatorio.',
            'cliente.string' => 'El nombre del cliente debe ser un texto válido.',
            'cliente.max' => 'El nombre del cliente no debe exceder los 255 caracteres.',

            'fecha_inicio.required' => 'Debe indicar la fecha de inicio de la reserva.',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida.',
            'fecha_inicio.after_or_equal' => 'La fecha de inicio debe ser hoy o una fecha futura.',

            'fecha_fin.required' => 'Debe indicar la fecha de finalización de la reserva.',
            'fecha_fin.date' => 'La fecha de finalización debe ser una fecha válida.',
            'fecha_fin.after' => 'La fecha de finalización debe ser después de la fecha de inicio.',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Validation\ValidationException($validator, response()->json([
            'ok' => false,
            'message' => 'Error de validación',
            'errors' => $validator->errors()
        ], 422));
    }

}
