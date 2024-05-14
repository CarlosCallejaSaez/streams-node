# Carlos Streams

Esta es una API simple para subir un archivo de texto, procesarlo convirtiendo todas las líneas a mayúsculas y agregando "Carlos Calleja Sáez" al final de cada línea usando streams, y luego descargar el archivo procesado.


## Monitoreo del uso de memoria durante el procesamiento del archivo

Esta característica permite monitorear el uso de memoria durante el procesamiento de archivos. El código a continuación muestra cómo calcular y registrar la diferencia en el uso de memoria antes y después del procesamiento de un archivo utilizando `process.memoryUsage()`.

Este monitoreo es útil para comprender el impacto en la memoria de operaciones de lectura y escritura intensivas de archivos, como la transformación de grandes conjuntos de datos. Identificar el uso excesivo de memoria puede ayudar a optimizar el rendimiento de la aplicación y prevenir problemas de escalabilidad.

```javascript
writableStream.on('finish', () => {
    const memoryAfter = process.memoryUsage();

    // Calcula la diferencia en cada categoría de memoria
    const memoryDiff = {
        heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
        heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
        external: memoryAfter.external - memoryBefore.external,
        rss: memoryAfter.rss - memoryBefore.rss
    };

    console.log('Uso de memoria antes de procesar:', memoryBefore);
    console.log('Uso de memoria después de procesar:', memoryAfter);
    console.log('Diferencia:', memoryDiff);
});
```



## Endpoints de la API

### Subir un Archivo

- **URL:** `/upload`
- **Método:** `POST`
- **Parámetro:** `file` (archivo de texto a subir)

### Descargar el Archivo Procesado

- **URL:** `/download`
- **Método:** `GET`

