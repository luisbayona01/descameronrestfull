<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
     
    protected $table = 'hoteles';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre', 'direccion', 'ciudad_id', 'nit', 'numero_habitaciones'];

    public function habitaciones()
    {
        return $this->hasMany(Habitacion::class);
    }
}