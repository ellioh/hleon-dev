# PHP-FPM para backend/laravel. Una sola imagen sirve tanto para
# desarrollo (con el código montado como volumen, ver docker-compose.yml)
# como para producción (con COPY del código, sin volumen) - mismo
# Dockerfile, dos modos, tal como se definió en la revisión de arquitectura.
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
        icu-dev \
        libzip-dev \
        oniguruma-dev \
        libpng-dev \
        freetype-dev \
        libjpeg-turbo-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        bcmath \
        intl \
        zip \
        gd \
        opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# En producción, el pipeline de despliegue copia el código antes de build
# (ver docs/adr/0005). En desarrollo, docker-compose.yml monta
# backend/laravel encima de este directorio - COPY aquí solo importa para
# el caso de producción real.
COPY backend/laravel/composer.json backend/laravel/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY backend/laravel/. .
RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
