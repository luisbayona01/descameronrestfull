<?php

namespace App\Http\Controllers;

use App\Models\Habitacion;
use Illuminate\Http\Request;
use App\Http\Requests\HabitacionRequest;
use  App\Models\TipoHabitacion;
use  App\Models\Acomodacion;

class HabitacionController extends Controller
{
    public function store(HabitacionRequest $request)
    {
        // Validar acomodación según tipo de habitación
        $habitacion = Habitacion::create([
            'hotel_id' => $request->hotel_id,
            'tipo_habitacion_id' => $request->tipo_habitacion_id,
            'acomodacion_id' => $request->acomodacion_id,
            'cantidad' => $request->cantidad
        ]);
    
        return response()->json([
            'ok' => true,
            'message' => 'Habitación registrada correctamente.',
            'habitacion' => $habitacion
        ], 201);
    }
    
    public function Tipohabitacion()
    {
        $tiposHabitacion = TipoHabitacion::select('id', 'nombre')->get();
        return response()->json($tiposHabitacion);
    }

    public function Acomodaciones()
    {
        $acomodaciones = Acomodacion::select('id', 'nombre')->get();
        return response()->json($acomodaciones);
    }
    
    public  function  showhabitacionhotel($id){
        $habitaciones = Habitacion::select(
            'habitaciones_hoteles.id',
            'tipos_habitacion.nombre as tipo',
            'acomodaciones.nombre as acomodacion',
            'habitaciones_hoteles.cantidad'
        )
        ->join('acomodaciones', 'habitaciones_hoteles.acomodacion_id', '=', 'acomodaciones.id')
        ->join('tipos_habitacion', 'tipos_habitacion.id', '=', 'habitaciones_hoteles.tipo_habitacion_id')
        ->where('habitaciones_hoteles.hotel_id', $id)
        ->get();
        return response()->json($habitaciones);
  
    }

    public function  show($id){
        $habitaciones = Habitacion::find($id);
        return response()->json($habitaciones);

    } 

    public function update(HabitacionRequest $request,$id)
    {   $habitacion = Habitacion::find($id);

        if (!$habitacion) {
            return response()->json(['ok' => false, 'message' => 'Habitación no encontrada'], 404);
        }
    
        $data = $request->validated();
        $habitacion->update($data);
    
        return response()->json([
            'ok' => true,
            'message' => 'Habitación actualizada',
            'habitacion' => $habitacion
        ]);
    }
    public function destroy($id)
    {
        $deleted = Habitacion::find($id)->delete();

        if ($deleted) {
            return response()->json([
                'ok' => true,
                'message' => 'Habitacion eliminada correctamente'
            ]);
        } else {
            return response()->json([
                'ok' => false,
                'message' => 'Error al eliminar el hotel'
            ], 500);
        }
    }



}