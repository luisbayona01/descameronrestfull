<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class AcomodacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $acomodaciones = ['Sencilla', 'Doble', 'Triple', 'Cuádruple'];

        foreach ($acomodaciones as $acomodacion) {
            DB::table('acomodaciones')->insert([
                'nombre' => $acomodacion,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
