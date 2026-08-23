<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Proyecto;
use App\Models\Tecnologia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Migra los 4 proyectos REALES que ya existían en data/proyectos.json del
 * sitio anterior. Solo se migran los datos factuales que ese archivo
 * tenía (nombre, descripción, tecnologías, categoría, url pública,
 * destacado, orden). NO se inventa el_desafio/la_solucion/mi_rol,
 * fecha_inicio, ni modalidad - esos campos quedan vacíos y el proyecto
 * en estado 'borrador' hasta que se redacte el contenido real desde el
 * admin (decisión explícita, ver ADR 0006).
 */
class ProyectoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = $this->asegurarCategorias(['ERP', 'CRM', 'APIs', 'E-commerce', 'Consultoría', 'Automatización', 'Desarrollo Web', 'General']);
        $tecnologias = $this->asegurarTecnologias([
            'Laravel' => 'backend', 'MySQL' => 'basededatos', 'PostgreSQL' => 'basededatos',
            'Vue.js' => 'frontend', 'Next.js' => 'frontend', 'Bootstrap' => 'frontend',
            'Redis' => 'infraestructura', 'Docker' => 'infraestructura', 'Linux/VPS' => 'infraestructura',
            'PHP' => 'lenguaje', 'Python' => 'lenguaje', 'JavaScript' => 'lenguaje', 'TypeScript' => 'lenguaje',
            'REST APIs' => 'herramienta', 'AI' => 'otro',
        ]);

        $proyectosReales = [
            [
                'nombre' => 'Sistema ERP Textil',
                'resumen_ejecutivo' => 'Plataforma integral de gestión empresarial para empresa textil con módulos de producción, inventario, ventas y contabilidad.',
                'categoria' => 'ERP',
                'tecnologias' => ['Laravel', 'MySQL', 'Vue.js', 'Redis'],
                'url_publica' => null,
                'destacado' => true,
                'orden' => 1,
            ],
            [
                'nombre' => 'Portal de Comparación de Precios',
                'resumen_ejecutivo' => 'Plataforma web de comparación de precios en tiempo real con scraping automatizado, clasificación por IA y panel de gestión.',
                'categoria' => 'E-commerce',
                'tecnologias' => ['Next.js', 'Laravel', 'MySQL', 'Python', 'AI'],
                'url_publica' => 'https://compara2.pe',
                'destacado' => true,
                'orden' => 2,
            ],
            [
                'nombre' => 'Sistema de Agenda Legal',
                'resumen_ejecutivo' => 'Aplicación web para gestión de agenda, expedientes y clientes para estudio de abogados.',
                'categoria' => 'CRM',
                'tecnologias' => ['Laravel', 'MySQL', 'Bootstrap'],
                'url_publica' => null,
                'destacado' => false,
                'orden' => 3,
            ],
            [
                'nombre' => 'Sistema de Inventario y Ventas',
                'resumen_ejecutivo' => 'Control de inventario, punto de venta y reportes para cadena de tiendas de ropa.',
                'categoria' => 'ERP',
                'tecnologias' => ['PHP', 'MySQL', 'JavaScript'],
                'url_publica' => null,
                'destacado' => false,
                'orden' => 4,
            ],
        ];

        foreach ($proyectosReales as $datos) {
            $slug = Str::slug($datos['nombre']);

            $proyecto = Proyecto::withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'nombre' => $datos['nombre'],
                    'resumen_ejecutivo' => $datos['resumen_ejecutivo'],
                    'categoria_id' => $categorias[$datos['categoria']]->id,
                    'estado' => 'completado', // hecho objetivo: son sistemas ya entregados
                    'url_publica' => $datos['url_publica'],
                    'destacado' => $datos['destacado'],
                    'orden' => $datos['orden'],
                    'visible' => true,
                    'estado_publicacion' => 'borrador', // pendiente de redactar el_desafio/la_solucion/mi_rol
                    'el_desafio' => '',
                    'la_solucion' => '',
                    'mi_rol' => '',
                ]
            );

            $tecnologiaIds = collect($datos['tecnologias'])->map(fn ($nombre) => $tecnologias[$nombre]->id)->all();
            $proyecto->tecnologias()->sync($tecnologiaIds);
        }

        $this->command?->info('4 proyectos reales migrados como borrador (sin narrativa inventada).');
    }

    /** @return array<string, Categoria> */
    private function asegurarCategorias(array $nombres): array
    {
        $resultado = [];
        foreach ($nombres as $i => $nombre) {
            $resultado[$nombre] = Categoria::firstOrCreate(
                ['slug' => Str::slug($nombre)],
                ['nombre' => $nombre, 'tipo' => 'ambos', 'orden' => $i]
            );
        }

        return $resultado;
    }

    /** @return array<string, Tecnologia> */
    private function asegurarTecnologias(array $categoriaPorNombre): array
    {
        $resultado = [];
        $i = 0;
        foreach ($categoriaPorNombre as $nombre => $categoria) {
            $resultado[$nombre] = Tecnologia::firstOrCreate(
                ['slug' => Str::slug($nombre)],
                ['nombre' => $nombre, 'categoria' => $categoria, 'orden' => $i]
            );
            $i++;
        }

        return $resultado;
    }
}
