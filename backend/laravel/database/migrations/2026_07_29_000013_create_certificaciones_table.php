<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 160);
            $table->string('emisor', 120);
            $table->date('fecha_obtencion');
            $table->date('fecha_expiracion')->nullable();
            $table->string('credencial_id', 120)->nullable();
            $table->string('url_verificacion', 255)->nullable();
            $table->foreignId('imagen_insignia_id')->nullable()->constrained('media')->nullOnDelete();
            $table->boolean('destacado')->default(false);
            $table->boolean('visible')->default(true);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
            $table->timestamp('eliminado_en')->nullable();
        });

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE certificaciones ADD CONSTRAINT chk_certificaciones_expiracion CHECK (fecha_expiracion IS NULL OR fecha_expiracion > fecha_obtencion)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('certificaciones');
    }
};
