<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Servicio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Migra los 6 servicios REALES que ya estaban hardcodeados en la sección
 * #servicios de app/page.tsx (nombre, ícono, resumen breve - contenido
 * real, ya en producción). `visible = true` porque ya están en vivo hoy.
 *
 * `descripcion_completa` es un campo nuevo que no existía en el array
 * anterior - se deja igual al resumen breve (texto real, no inventado)
 * en vez de fabricar una versión expandida; se puede ampliar desde el
 * admin cuando haya contenido real más largo que escribir.
 */
class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        $serviciosReales = [
            [
                'nombre' => 'ERP / Gestión Empresarial',
                'icono_emoji' => '🏭',
                'resumen_breve' => 'Sistemas integrales que unifican producción, inventario, finanzas y RRHH en una sola plataforma adaptada a tu empresa.',
                'categoria' => 'ERP',
            ],
            [
                'nombre' => 'CRM / Gestión de Clientes',
                'icono_emoji' => '🤝',
                'resumen_breve' => 'Controla tu pipeline de ventas, historial de clientes, seguimiento de oportunidades y automatización de comunicaciones.',
                'categoria' => 'CRM',
            ],
            [
                'nombre' => 'E-commerce / Tiendas Online',
                'icono_emoji' => '🛒',
                'resumen_breve' => 'Plataformas de venta online con catálogo, carrito, pagos integrados y gestión de pedidos en tiempo real.',
                'categoria' => 'E-commerce',
            ],
            [
                'nombre' => 'APIs e Integraciones',
                'icono_emoji' => '🔌',
                'resumen_breve' => 'Conecta tus sistemas existentes con APIs REST, webhooks e integraciones con terceros como facturación electrónica, pasarelas de pago.',
                'categoria' => 'APIs',
            ],
            [
                'nombre' => 'Automatización de Procesos',
                'icono_emoji' => '⚙️',
                'resumen_breve' => 'Elimina tareas manuales repetitivas con bots, scripts y flujos automatizados que ahorran tiempo y reducen errores.',
                'categoria' => 'Automatización',
            ],
            [
                'nombre' => 'Consultoría Técnica',
                'icono_emoji' => '💡',
                'resumen_breve' => 'Auditoría de sistemas existentes, arquitectura de soluciones, elección de tecnología y hoja de ruta de digitalización.',
                'categoria' => 'Consultoría',
            ],
        ];

        foreach ($serviciosReales as $orden => $datos) {
            $categoria = Categoria::firstOrCreate(
                ['nombre' => $datos['categoria']],
                ['slug' => Str::slug($datos['categoria'])]
            );

            Servicio::updateOrCreate(
                ['slug' => Str::slug($datos['nombre'])],
                [
                    'nombre' => $datos['nombre'],
                    'icono_emoji' => $datos['icono_emoji'],
                    'resumen_breve' => $datos['resumen_breve'],
                    'descripcion_completa' => $datos['resumen_breve'],
                    'categoria_id' => $categoria->id,
                    'visible' => true,
                    'destacado' => false,
                    'orden' => $orden,
                ]
            );
        }

        $this->command?->info('6 servicios reales migrados desde app/page.tsx (visible=true, igual que en producción).');
    }
}
