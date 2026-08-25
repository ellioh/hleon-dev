<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();

        // Independiente del admin: taxonomía + los 4 proyectos reales
        // migrados de data/proyectos.json (ver ProyectoSeeder).
        $this->call(ProyectoSeeder::class);

        // Los 3 artículos reales solo se migran si ya existe un Perfil
        // (autor_id obligatorio, nunca se fabrica - ver PostSeeder).
        $this->call(PostSeeder::class);

        // Los 6 servicios reales ya estaban en producción (hardcodeados
        // en app/page.tsx) - sin dependencias bloqueantes, se migran siempre.
        $this->call(ServicioSeeder::class);
    }

    /**
     * Crea el único usuario administrador a partir de variables de entorno
     * - nunca con datos inventados. Si ADMIN_EMAIL/ADMIN_PASSWORD no están
     * definidos, el seeder se salta con un aviso en vez de fabricar una
     * cuenta de prueba (a diferencia del seeder por defecto de Laravel).
     */
    private function seedAdmin(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');
        $nombre = env('ADMIN_NOMBRE');

        if (! $email || ! $password || ! $nombre) {
            $this->command?->warn(
                'Seeder de administrador omitido: define ADMIN_NOMBRE, ADMIN_EMAIL y ADMIN_PASSWORD en .env para crear la cuenta real.'
            );

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'nombre' => $nombre,
                'password_hash' => bcrypt($password),
                'rol' => 'admin',
                'activo' => true,
            ]
        );

        $this->command?->info("Usuario administrador '{$email}' creado/actualizado.");
    }
}
