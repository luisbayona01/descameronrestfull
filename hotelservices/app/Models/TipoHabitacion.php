<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoHabitacion extends Model
{
    use HasFactory;
    protected $table = 'tipos_habitacion';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre'];

    public function habitaciones()
    {
        return $this->hasMany(Habitacion::class);
    }
}
