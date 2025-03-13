<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\LoginRequest;
trait AuthTrait
{
  
    /**
     * Inicio de sesión.
     */
    public function login(LoginRequest $request)
{
  
    $data = $request->only('email', 'password');

    if (!Auth::attempt($data)) {
        return response()->json([
            'ok' => false,
            'message' => 'Error de credenciales',
        ], 200);
    }

    $user = Auth::user();
    $token = $user->createToken('authToken')->accessToken;

    return response()->json([
        'ok' => true,
        'message' => 'Inicio de sesión exitoso',
        'user' => $user,
        'token' => $token
    ]);

   
}

    /**
     * Cierre de sesión.
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete(); // Revocar todos los tokens

            return response()->json([
                'ok' => true,
                'message' => 'Cierre de sesión exitoso'
            ]);
        }

        return response()->json([
            'ok' => false,
            'message' => 'No se pudo cerrar sesión'
        ], 400);
    }
}
