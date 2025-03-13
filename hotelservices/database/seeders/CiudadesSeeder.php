<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class CiudadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $ciudades = ['Bogotá', 'Cartagena', 'Medellín', 'Cali', 'Barranquilla'];

        foreach ($ciudades as $ciudad) {
            DB::table('ciudades')->insert([
                'nombre' => $ciudad,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
