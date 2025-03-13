<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acomodacion extends Model
{
    use HasFactory;
    protected $table = 'acomodaciones';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre'];

    public function habitaciones()
    {
        return $this->hasMany(Habitacion::class);
    }
}
