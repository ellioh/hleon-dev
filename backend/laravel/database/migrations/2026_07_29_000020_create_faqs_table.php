<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('pregunta', 200);
            $table->mediumText('respuesta');
            $table->enum('seccion', ['servicios', 'general', 'proceso', 'reclutamiento']);
            $table->boolean('visible')->default(true);
            $table->integer('orden')->default(0);
            $table->timestamp('creado_en')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
