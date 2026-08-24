<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organizacion;
use Illuminate\Http\Request;

/**
 * Solo admin: a diferencia de Categoria/Tecnologia, el listado de
 * organizaciones NO es público - exponerlo filtraría qué clientes
 * confidenciales existen aunque ningún proyecto público los mencione.
 */
class OrganizacionController extends Controller
{
    public function index(Request $request)
    {
        $query = Organizacion::query()->orderBy('orden');

        // ?tipo=empleador trae también 'ambos' - una organización marcada
        // como ambos es válida tanto para Proyecto (cliente) como para
        // Experiencia (empleador), nunca hay que filtrarla fuera de una
        // de las dos vistas.
        if ($tipo = $request->query('tipo')) {
            $query->whereIn('tipo', [$tipo, 'ambos']);
        }

        return $query->get(['id', 'nombre', 'tipo', 'rubro']);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'nombre_publico' => ['nullable', 'string', 'max:120'],
            'tipo' => ['required', 'in:cliente,empleador,ambos'],
            'url' => ['nullable', 'string', 'max:255', 'url'],
            'rubro' => ['nullable', 'string', 'max:80'],
        ]);

        return Organizacion::create($datos);
    }
}
