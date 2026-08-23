<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Puerto de packages/db/migrations/0001_create_usuarios.sql (repositorio TS,
// Iteración 1) - mismo diseño, ahora vía Schema Builder de Laravel. Es la
// tabla de autenticación del backoffice (guard configurado en config/auth.php).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('email', 190)->unique();
            $table->string('password_hash', 255);
            $table->enum('rol', ['admin', 'editor'])->default('admin');
            $table->boolean('activo')->default(true);
            $table->dateTime('ultimo_acceso')->nullable();
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
