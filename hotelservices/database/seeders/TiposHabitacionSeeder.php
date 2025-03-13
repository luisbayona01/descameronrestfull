<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class TiposHabitacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $tipos = ['Estándar', 'Junior', 'Suite'];

        foreach ($tipos as $tipo) {
            DB::table('tipos_habitacion')->insert([
                'nombre' => $tipo,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
