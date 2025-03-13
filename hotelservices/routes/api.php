<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\HabitacionController;
use App\Http\Controllers\ReservaController;

use App\Http\Controllers\AuthController;


Route::post('/login', [AuthController::class, 'login']);



// Rutas protegidas por autenticación
Route::middleware(['auth:api'])->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Rutas para Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('hotels', HotelController::class);
        Route::apiResource('habitaciones', HabitacionController::class);
       
        Route::get('/tipos-habitacion', [HabitacionController::class, 'Tipohabitacion']);
        Route::get('/acomodaciones', [HabitacionController::class, 'Acomodaciones']);
        ///hotels/${hotelId}/rooms`
        Route::get('/hotels/{hotelId}/rooms', [HabitacionController::class, 'showhabitacionhotel']);

        Route::get('/ciudades', [HotelController::class, 'getciudades']);
        //
   
    });

   
});




/*
tipos-habitacion
acomodaciones
*/