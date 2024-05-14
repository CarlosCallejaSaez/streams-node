const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Transform } = require('stream');

const app = express();
const port = 5000;

const upload = multer({ dest: 'uploads/' });

const transformLine = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase() + ' CARLOS CALLEJA SÁEZ\n');
    callback();
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const processedFilePath = path.join(__dirname, 'uploads', 'procesado.txt');

  const readableStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const writableStream = fs.createWriteStream(processedFilePath);


  const memoryBefore = process.memoryUsage();

  const rl = readline.createInterface({
    input: readableStream
  });

  rl.on('line', (line) => {
    transformLine.write(line + '\n');
  });

  rl.on('close', () => {
    transformLine.end();
  });

  transformLine.pipe(writableStream);

  writableStream.on('finish', () => {
    
    const memoryAfter = process.memoryUsage();
    const memoryDiff = {
        heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
        heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
        external: memoryAfter.external - memoryBefore.external,
        rss: memoryAfter.rss - memoryBefore.rss
    };

    console.log('Uso de memoria antes de procesar:', memoryBefore);
    console.log('Uso de memoria después de procesar:', memoryAfter);
    console.log('Diferencia:', memoryDiff);
    res.send('Archivo subido y procesado correctamente. Puedes descargar el archivo procesado en /download');
  });

  writableStream.on('error', (err) => {
    console.error('Error durante la escritura del archivo:', err);
    res.status(500).send('Error durante el procesamiento del archivo.');
  });
});


app.get('/download', (req, res) => {
  const processedFilePath = path.join(__dirname, 'uploads', 'procesado.txt');
  res.download(processedFilePath, 'procesado.txt', (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      res.status(500).send('Error al descargar el archivo.');
    }
  });
});





app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });