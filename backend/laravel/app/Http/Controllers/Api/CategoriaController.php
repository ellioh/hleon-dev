<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Illuminate\Http\Request;

/**
 * Listado simple, público - alimenta tanto el filtro de /portafolio en
 * Next.js como el <select> de categoría en el formulario de admin.
 */
class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = Categoria::query()->orderBy('orden');

        if ($request->filled('tipo')) {
            $query->whereIn('tipo', [$request->query('tipo'), 'ambos']);
        }

        return CategoriaResource::collection($query->get());
    }
}
