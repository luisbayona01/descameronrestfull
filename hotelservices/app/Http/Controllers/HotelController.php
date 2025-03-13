<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Http\Requests\HotelRequest;
use  App\Models\Ciudad;
use Illuminate\Auth\Events\Validated;

class HotelController extends Controller
{
    public function index()
    {
        $hoteles = Hotel::join('ciudades as c', 'c.id', '=', 'hoteles.ciudad_id')
            ->select('hoteles.id', 'hoteles.nombre', 'hoteles.direccion', 'c.nombre as ciudad', 'hoteles.nit', 'hoteles.numero_habitaciones as capacidad')
            ->get();
        return response()->json([
            'ok' => true,
            'data' => $hoteles
        ]);
    }

    public function store(HotelRequest $request)
    {
        $data = $request->validated();
        unset($data['ciudad'], $data['capacidad']);
        $data['ciudad_id'] = $request->ciudad;
        $data['numero_habitaciones'] = $request->capacidad;
        //dd($data);
        $hotel = Hotel::create($data);

        if ($hotel) {

            /*  hacer  la consulta de nuevo*/
            $hotelConCiudad = Hotel::join('ciudades as c', 'c.id', '=', 'hoteles.ciudad_id')
                ->where('hoteles.id', $hotel->id)
                ->select('hoteles.id', 'hoteles.nombre', 'hoteles.direccion', 'c.nombre as ciudad', 'hoteles.nit', 'hoteles.numero_habitaciones as capacidad')
                ->first();
            return response()->json([
                'ok' => true,
                'message' => 'Hotel registrado correctamente',
                'data' => $hotelConCiudad
            ], 201);
        } else {
            return response()->json([
                'ok' => false,
                'message' => 'Error al registrar el hotel'
            ], 500);
        }
    }

    public function show(Hotel $hotel)
    {    $hotelConCiudad = Hotel::join('ciudades as c', 'c.id', '=', 'hoteles.ciudad_id')
        ->where('hoteles.id', $hotel->id)
        ->select('hoteles.id', 'hoteles.nombre', 'hoteles.direccion', 'c.nombre as ciudad', 'hoteles.nit', 'hoteles.numero_habitaciones as capacidad')
        ->first();
        return response()->json([
            'ok' => true,
            'data' => $hotelConCiudad
        ]);
    }

    public function update(HotelRequest $request, Hotel $hotel)
    {   //dd($request->capacidad);   
        $data = $request->validated();
        unset($data['ciudad'], $data['capacidad']);
        $data['ciudad_id'] = $request->ciudad;
        $data['numero_habitaciones'] = $request->capacidad;
        $updated = $hotel->update($data);

        if ($updated) {
            $hotelConCiudad = Hotel::join('ciudades as c', 'c.id', '=', 'hoteles.ciudad_id')
                ->where('hoteles.id', $hotel->id)
                ->select('hoteles.id', 'hoteles.nombre', 'hoteles.direccion', 'c.nombre as ciudad', 'hoteles.nit', 'hoteles.numero_habitaciones as capacidad')
                ->first();
            return response()->json([
                'ok' => true,
                'message' => 'Hotel actualizado correctamente',
                'data' => $hotelConCiudad
            ]);
        } else {
            return response()->json([
                'ok' => false,
                'message' => 'Error al actualizar el hotel'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $deleted = hotel::find($id)->delete();

        if ($deleted) {
            return response()->json([
                'ok' => true,
                'message' => 'Hotel eliminado correctamente'
            ]);
        } else {
            return response()->json([
                'ok' => false,
                'message' => 'Error al eliminar el hotel'
            ], 500);
        }
    }

    public  function getciudades()
    {
        $ciudades = ciudad::select('id', 'nombre')->get();
        return response()->json($ciudades);
    }
}
