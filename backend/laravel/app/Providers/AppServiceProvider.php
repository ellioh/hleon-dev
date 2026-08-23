<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // GD ya está disponible en la imagen Docker de Laravel (Fase 1);
        // sin necesidad de la extensión Imagick para lo que MediaService hace.
        $this->app->singleton(ImageManager::class, fn () => new ImageManager(new Driver()));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
