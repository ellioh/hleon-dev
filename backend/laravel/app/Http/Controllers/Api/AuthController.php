<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Auth por cookie de sesión (Sanctum SPA), no por token - el único
 * consumidor de esta API es admin.hleon.dev, un frontend propio, no un
 * cliente de terceros. Ver bootstrap/app.php (statefulApi()) y
 * SANCTUM_STATEFUL_DOMAINS en .env.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request): User
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        if (! $user->activo) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => ['Esta cuenta está desactivada.'],
            ]);
        }

        $user->forceFill(['ultimo_acceso' => now()])->save();

        return $user;
    }

    public function logout(Request $request): array
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ['ok' => true];
    }

    public function me(Request $request): User
    {
        return $request->user();
    }
}
