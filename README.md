# ÓRBITA · Grapple Lab

Juego de plataformas en HTML, CSS y JavaScript, con 15 pantallas y una pistola de gancho para balancearse. No requiere paquetes, compilación, cuentas ni recursos externos.

## Jugar en local

Desde la raíz del repositorio:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Abre el servidor en un navegador moderno. Usa un servidor HTTP: los módulos de JavaScript no se pueden cargar de forma fiable con `file://`.

## Controles

- **A / D** o **← / →**: moverse e impulsar el balanceo.
- **Espacio / ↑**: saltar.
- **Clic mantenido** sobre un anclaje luminoso o plataforma: engancharse; soltar para liberar la cuerda.
- **W**: acortar la cuerda.
- **E mantenida**: engancharse al anclaje cercano.
- **R**: reiniciar la pantalla.
- **Esc / P**: pausar.
- **Móvil**: botones de dirección, salto y gancho; también se puede tocar un anclaje. El botón de gancho recoge la cuerda automáticamente.

Cruza el portal verde para avanzar. Cada sector contiene tres núcleos opcionales. Las banderas guardan un punto de control durante el intento. El progreso de sectores y las mejores marcas se guardan en el navegador con `localStorage`, cuando está disponible. El sonido es sintetizado y se activa voluntariamente.

## Estructura y comprobaciones

- `index.html`, `style.css`: interfaz adaptable y controles.
- `engine.mjs`: 15 niveles, física, colisiones y reglas independientes del navegador.
- `game.js`: renderizado Canvas, entrada, sonido y progreso.
- `tests/engine.test.mjs`: pruebas de mecánicas mediante el ejecutor nativo de Node.

```sh
node tests/engine.test.mjs
```

No hay dependencias de producción. Para pruebas gráficas se puede usar Playwright con Chromium. El diseño adapta el lienzo al tamaño disponible; para mayor precisión en móvil se recomienda jugar en horizontal.
