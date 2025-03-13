<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RolesAndUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   
        public function run()
        {
            // Crear roles
            $adminRole = Role::firstOrCreate(['name' => 'admin']);
            $clientRole = Role::firstOrCreate(['name' => 'cliente']);
    
            // Crear usuario administrador
            $adminUser = User::create([
                'name' => 'Administrador',
                'email' => 'admin@example.com',
                'password' => bcrypt('password123'),
                'role_id' => $adminRole->id, // Asigna el role_id
            ]);
            $adminUser->assignRole('admin'); // Asigna el rol de Laravel Permission
    
            // Crear usuario cliente
            $clientUser = User::create([
                'name' => 'Cliente Usuario',
                'email' => 'cliente@example.com',
                'password' => bcrypt('password123'),
                'role_id' => $clientRole->id, // Asigna el role_id
            ]);
            $clientUser->assignRole('cliente'); // Asigna el rol de Laravel Permission
        }
    }

