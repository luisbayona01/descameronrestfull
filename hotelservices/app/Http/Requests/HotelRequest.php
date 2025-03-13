<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HotelRequest extends FormRequest
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
    public function rules()
    {    
        $hotelId = $this->route('hotel') ? $this->route('hotel')->id : null;
       
        return [
            'nombre' => 'required|string|unique:hoteles,nombre,' . ($hotelId ?? 'NULL') . ',id',
            'direccion' => 'required|string',
            'ciudad' => 'required',
            'nit' => $hotelId ? 'nullable|string|unique:hoteles,nit,' . $hotelId . ',id' : 'required|string|unique:hoteles,nit',
            'capacidad' => 'required|integer|min:1',
        ];
    }

   
    public function messages()
    {
        return [
            'nombre.required' => 'El nombre del hotel es obligatorio.',
            'nombre.unique' => 'El nombre del hotel ya está registrado.',
            'direccion.required' => 'La dirección es obligatoria.',
            'ciudad.required' => 'La ciudad es obligatoria.',
            'nit.required' => 'El NIT es obligatorio.',
            'nit.unique' => 'El NIT ya está registrado.',
            'capacidad.required' => 'El número de habitaciones es obligatorio.',
            'capacidad.integer' => 'El número de habitaciones debe ser un número entero.',
            'capacidad.min' => 'El número de habitaciones debe ser al menos 1.',
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
