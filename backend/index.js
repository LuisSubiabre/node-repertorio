const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');

const fileName = 'repertorio.json';

//middleware
app.use(express.json()); //Middleware para transformar el body en json
app.use(cors()); //Middleware para habilitar CORS

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port} 👌`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/canciones', (req, res) => {
    const cancion = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    res.json(cancion);

});

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const cancion = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    cancion.push(nuevaCancion);
    fs.writeFileSync(fileName, JSON.stringify(cancion), 'utf-8');
    res.status(201).json({ message: 'Canción agregada correctamente' });
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancion = req.body;
    cancion.id = Number(id);
    const canciones = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    const index = canciones.findIndex(canciones => canciones.id == id);
    console.log(index);

    if (index !== -1) {
        canciones[index] = req.body;
        fs.writeFileSync(fileName, JSON.stringify(canciones), 'utf-8');
        res.send('Producto actualizado');
    } else {
        res.send('Producto no encontrado');
    }
});


app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params; // Destructuring id
    const canciones = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    const index = canciones.findIndex(d => d.id == id); // Filtra el id
    console.log("->" + canciones.splice(index, 1)); // Elimina el id
    fs.writeFileSync(fileName, JSON.stringify(canciones), 'utf-8');
    res.json({ message: 'Canción eliminada correctamente' });
});

