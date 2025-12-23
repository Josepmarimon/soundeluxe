# Configuración de Imagen de Fondo Lujosa

## Opción 1: Usar Imágenes de Stock Premium (Actual)
El diseño actual utiliza imágenes de Unsplash con un efecto bokeh aplicado mediante CSS. Las imágenes se cargan desde URLs externas.

## Opción 2: Usar Imágenes Locales de Alta Calidad

### Imágenes Recomendadas
Para obtener el mejor resultado visual, busca imágenes con estas características:

1. **Estudio de Música Profesional**
   - Resolución mínima: 1920x1080px
   - Elementos deseados:
     - Consola de mezclas iluminada
     - Equipos de audio profesionales
     - Luces LED ambientales
     - Monitores de estudio
     - Ambiente oscuro con luces puntuales

2. **Características Visuales**
   - Fondo oscuro (preferiblemente negro o gris muy oscuro)
   - Puntos de luz brillantes (LEDs, pantallas, indicadores)
   - Profundidad de campo reducida para efecto bokeh natural
   - Colores vibrantes (azules, púrpuras, dorados)

### Cómo Implementar Imágenes Locales

1. **Crea una carpeta `images` en el proyecto**
```bash
mkdir images
```

2. **Añade tu imagen de fondo**
   - Nombra tu archivo: `studio-background.jpg`
   - Colócalo en la carpeta `images/`

3. **Actualiza el CSS**

En `styles.css`, busca la sección `.hero-background::before` y reemplaza el background con:

```css
.hero-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        linear-gradient(rgba(10, 10, 10, 0.3), rgba(10, 10, 10, 0.5)),
        url('./images/studio-background.jpg') center/cover;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(25px) brightness(0.6) saturate(1.3);
    transform: scale(1.1);
}
```

### Sitios Recomendados para Imágenes Premium

1. **Gratuitas de Alta Calidad**
   - Unsplash.com - Buscar "music studio", "recording studio", "mixing console"
   - Pexels.com - Buscar "studio equipment", "audio production"
   - Pixabay.com - Buscar "music production", "sound engineer"

2. **Premium (Pago)**
   - Shutterstock.com
   - Getty Images
   - Adobe Stock

### Palabras Clave de Búsqueda
- "luxury recording studio dark"
- "professional mixing console lights"
- "music studio bokeh lights"
- "audio equipment dark ambient"
- "recording studio neon lights"
- "sound engineering workspace"

### Optimización de la Imagen

Para mejor rendimiento web:

1. **Formato**: Usa WebP o JPEG optimizado
2. **Tamaño**: Máximo 500KB para carga rápida
3. **Resolución**: 1920x1080px es suficiente
4. **Compresión**: Usa herramientas como:
   - TinyPNG.com
   - Squoosh.app
   - ImageOptim (Mac)

### Efecto Bokeh Adicional

Si tu imagen no tiene suficiente efecto bokeh natural, el CSS actual aplicará:
- Blur de 25px para efecto bokeh
- Brightness al 60% para mejor contraste con el texto
- Saturación al 130% para colores más vibrantes

El efecto final combina:
- Imagen de fondo borrosa
- Partículas bokeh animadas (luces doradas, blancas, púrpuras)
- Gradientes de color sutiles
- Overlays para mejor legibilidad del texto