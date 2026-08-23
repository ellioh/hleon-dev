<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // La tabla de autenticación es `usuarios` (ver
        // 2026_07_29_000001_create_usuarios_table.php), no la `users`
        // por defecto de Laravel - se mantiene el esquema en español ya
        // aprobado en el documento de diseño del CMS. password_reset_tokens
        // y sessions sí se conservan: son infraestructura interna de
        // Laravel (recuperación de contraseña y sesiones de Sanctum SPA),
        // independientes del nombre de la tabla de usuarios.
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
