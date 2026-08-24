<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Perfil;
use App\Models\Post;
use Illuminate\Database\Seeder;

/**
 * Migra los 3 artículos REALES que ya existían en data/posts.json y ya
 * están publicados en el sitio en vivo - a diferencia de ProyectoSeeder,
 * este contenido SÍ está completo (no hay narrativa pendiente), así que
 * se migran como `publicado = true`, igual que están hoy en producción.
 *
 * Se salta por completo si todavía no existe un Perfil (autor_id es
 * obligatorio y nunca se fabrica - ver PerfilService/ADR de Blog). Correr
 * de nuevo este seeder después de completar "Mi perfil" en el admin.
 */
class PostSeeder extends Seeder
{
    public function run(): void
    {
        $perfil = Perfil::first();

        if (! $perfil) {
            $this->command?->warn(
                'PostSeeder omitido: completa "Mi perfil" en el admin antes de migrar los artículos reales (autor_id es obligatorio).'
            );

            return;
        }

        $postsReales = [
            [
                'titulo' => 'Cómo implementar un ERP en tu PYME sin fracasar en el intento',
                'slug' => 'como-implementar-erp-pyme-sin-fracasar',
                'resumen' => 'La mayoría de implementaciones ERP en pequeñas empresas fracasan, no por el software, sino por la falta de planificación. Aprende los pasos clave para una implementación exitosa.',
                'contenido' => file_get_contents(__DIR__.'/content/como-implementar-erp-pyme-sin-fracasar.md'),
                'categoria' => 'ERP',
                'tags' => ['erp', 'pyme', 'sistemas empresariales', 'digitalización'],
                'fecha_publicacion' => '2026-06-01 10:00:00',
            ],
            [
                'titulo' => '¿Tu empresa necesita una API REST? Cuándo construir una y cuándo no',
                'slug' => 'api-rest-para-tu-negocio-cuando-y-por-que',
                'resumen' => 'Las APIs no son solo para grandes empresas tecnológicas. Descubre cuándo tiene sentido que tu negocio invierta en una API propia y qué beneficios concretos te traerá.',
                'contenido' => file_get_contents(__DIR__.'/content/api-rest-para-tu-negocio-cuando-y-por-que.md'),
                'categoria' => 'APIs',
                'tags' => ['api', 'integración de sistemas', 'desarrollo web', 'automatización'],
                'fecha_publicacion' => '2026-06-10 10:00:00',
            ],
            [
                'titulo' => 'Cómo digitalizar tu empresa sin gastar una fortuna: estrategia por fases',
                'slug' => 'digitalizar-empresa-sin-gastar-fortuna',
                'resumen' => 'Digitalizar no significa comprar el software más caro. Aprende la estrategia por fases que usan las empresas más eficientes para llevar su negocio al siguiente nivel tecnológico con presupuesto controlado.',
                'contenido' => file_get_contents(__DIR__.'/content/digitalizar-empresa-sin-gastar-fortuna.md'),
                'categoria' => 'Consultoría',
                'tags' => ['digitalización', 'transformación digital', 'pyme', 'estrategia tecnológica'],
                'fecha_publicacion' => '2026-06-18 10:00:00',
            ],
        ];

        foreach ($postsReales as $datos) {
            $categoria = Categoria::firstOrCreate(['nombre' => $datos['categoria']], ['slug' => \Illuminate\Support\Str::slug($datos['categoria'])]);

            Post::updateOrCreate(
                ['slug' => $datos['slug']],
                [
                    'titulo' => $datos['titulo'],
                    'resumen' => $datos['resumen'],
                    'contenido' => $datos['contenido'],
                    'categoria_id' => $categoria->id,
                    'tipo_audiencia' => 'ambos',
                    'tags' => $datos['tags'],
                    'autor_id' => $perfil->id,
                    'publicado' => true,
                    'fecha_publicacion' => $datos['fecha_publicacion'],
                ]
            );
        }

        $this->command?->info('3 artículos reales migrados y publicados (igual que en producción).');
    }
}
