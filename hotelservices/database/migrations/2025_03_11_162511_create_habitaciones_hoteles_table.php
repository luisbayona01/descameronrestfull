<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('habitaciones_hoteles', function (Blueprint $table) { 
            $table->id();
            $table->foreignId('hotel_id')->constrained('hoteles')->onDelete('cascade');
            $table->foreignId('tipo_habitacion_id')->constrained('tipos_habitacion')->onDelete('cascade');
            $table->foreignId('acomodacion_id')->constrained('acomodaciones')->onDelete('cascade');
            $table->integer('cantidad'); // Número de habitaciones de ese tipo en el hotel
            $table->timestamps();
            // Restricción: No se pueden repetir el mismo tipo de habitación y acomodación en un hotel
            $table->unique(['hotel_id', 'tipo_habitacion_id', 'acomodacion_id']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habitaciones');
    }
};
