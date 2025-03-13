<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use App\Http\Requests\ReservaRequest;
use App\Models\Habitacion;
class ReservaController extends Controller
{
    public function store(ReservaRequest $request)
    {
        // Validar disponibilidad de habitaciones
        $disponibles = Habitacion::where('hotel_id', $request->hotel_id)
            ->where('tipo_habitacion', $request->tipo_habitacion)
            ->where('acomodacion', $request->acomodacion)
            ->whereDoesntHave('reservas', function ($query) use ($request) {
                $query->whereBetween('fecha', [$request->fecha_inicio, $request->fecha_fin]);
            })->exists();

        if (!$disponibles) {
            return response()->json(['error' => 'No hay habitaciones disponibles'], 400);
        }

        $reserva = Reserva::create($request->validated());
        return response()->json($reserva, 201);
    }
}