<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\Habitacion;
use App\Models\Hotel;
use App\Models\TipoHabitacion;
use App\Models\Acomodacion;
use Termwind\Components\Dd;

class HabitacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hotel_id' => 'required|exists:hoteles,id',
            'tipo_habitacion_id' => 'required|exists:tipos_habitacion,id',
            'acomodacion_id' => 'required|exists:acomodaciones,id',
            'cantidad' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'hotel_id.required' => 'El ID del hotel es obligatorio.',
            'hotel_id.exists' => 'El hotel seleccionado no existe.',
            'tipo_habitacion_id.required' => 'El tipo de habitación es obligatorio.',
            'tipo_habitacion_id.exists' => 'El tipo de habitación seleccionado no existe.',
            'acomodacion_id.required' => 'La acomodación es obligatoria.',
            'acomodacion_id.exists' => 'La acomodación seleccionada no existe.',
            'cantidad.required' => 'La cantidad de habitaciones es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad de habitaciones debe ser al menos 1.'
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $hotel = Hotel::find($this->hotel_id);

            if ($hotel) {
                //dd($this->route('habitacione'));
                $totalHabitacionesAsignadas = Habitacion::where('hotel_id', $this->hotel_id)->sum('cantidad');

                // Si se está editando una habitación, restar la cantidad anterior
                if ($this->route('habitacione')) { 
                    $habitacionActual = Habitacion::find($this->route('habitacione'));
                    if ($habitacionActual) {
                        $totalHabitacionesAsignadas -= $habitacionActual->cantidad;
                    }
                }

                $cantidadSolicitada = (int) $this->cantidad;

                // Validar que la suma no supere el máximo permitido por el hotel
                if (($totalHabitacionesAsignadas + $cantidadSolicitada) > $hotel->numero_habitaciones) {
                    $validator->errors()->add('cantidad', 'La cantidad de habitaciones configuradas no debe superar el máximo permitido por el hotel.');
                }
            }

            // Validación de reglas de acomodación según el tipo de habitación
            $reglasAcomodacion = [
                1 => ['Sencilla', 'Doble'],  
                2 => ['Triple', 'Cuádruple'],  
                3 => ['Sencilla', 'Doble', 'Triple']  
            ];

            $tipoHabitacion = TipoHabitacion::find($this->tipo_habitacion_id);
            $acomodacion = Acomodacion::find($this->acomodacion_id);

            if ($tipoHabitacion && $acomodacion) {
                if (!in_array($acomodacion->nombre, $reglasAcomodacion[$tipoHabitacion->id] ?? [])) {
                    $validator->errors()->add('acomodacion_id', 'La acomodación seleccionada no es válida para este tipo de habitación.');
                }
            }

            // Validación para evitar duplicados en el mismo hotel (solo si es un nuevo registro)
            $existeRegistro = Habitacion::where([
                ['hotel_id', '=', $this->hotel_id],
                ['tipo_habitacion_id', '=', $this->tipo_habitacion_id],
                ['acomodacion_id', '=', $this->acomodacion_id]
            ]);

            if ($this->route('habitacione')) {
                // Si es edición, excluir el ID actual de la validación
                $existeRegistro->where('id', '!=', $this->route('habitacion'));
            }

            if (!$this->route('habitacione') && $existeRegistro->exists()) {
                // Solo validar duplicados en la creación (no en la edición)
                $validator->errors()->add('habitacion', 'Ya existe un registro con este tipo de habitación y acomodación para este hotel.');
            }
        });
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
