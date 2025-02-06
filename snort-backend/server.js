const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ALERT_FILE = '/var/log/snort/alert'; 

// Ruta para la raíz del servidor
app.get('/', (req, res) => {
    res.send('Server is running. Use /alerts to get alerts.');
});

// Ruta para obtener alertas
app.get('/alerts', (req, res) => {
    fs.readFile(ALERT_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo el archivo de alertas:', err);
            return res.status(500).json({ error: 'Error reading alert file' });
        }
        const alerts = data.split('\n').filter(alert => alert.trim() !== '');
        res.json(alerts);
    });
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
