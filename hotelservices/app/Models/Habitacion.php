<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habitacion extends Model
{
    use HasFactory;
    protected $table = 'habitaciones_hoteles';
    protected $primaryKey = 'id';
    protected $fillable = ['hotel_id', 'tipo_habitacion_id', 'acomodacion_id', 'cantidad'];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function tipoHabitacion()
    {
        return $this->belongsTo(TipoHabitacion::class);
    }

    public function acomodacion()
    {
        return $this->belongsTo(Acomodacion::class);
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}
