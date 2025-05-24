
var admin = require("firebase-admin");
var serviceAccount = require("../firestore-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();




const express = require('express');
const router = express.Router();
const cors = require('cors');


//Las siguientes consultas no importa el orden, son totalmente asincronas
router.get('/', (req, res) => {
    res.send({ message: "Hola Mundo Juan Mauricio Montoya" });
});

router.post('/login', (req, res) => {
    // const admins = [
    //     { username: 'admin1', password: '1234', nombre: 'María González' },
    //     { username: 'admin2', password: 'abcd', nombre: 'Carlos Pérez' },
    //     { username: 'admin3', password: '5678', nombre: 'Ana Ramírez' }
    // ];

    let admins;

    // Llamamos a la base de datos, a la coleccion users
    // este obtendra los valores y cuando sea asi realizara la asignacion y respondera con el json de los datos
    db.collection('users').get().then(data => {
        admins = data.docs.map(doc => doc.data());

        // console.log(admins);

        // Asignamos los datos que enviamos ocultos a este tipo de dato
        const { username, password } = req.body;
        // De los datos obtenidos de la bd buscamos los que coincidan con las credenciales
        const found = admins.find(u => u.username === username && u.password === password) || null;

        //por ultimo enviamos una respuesta al cliente
        res.json({ user: found });
    });

});

module.exports = router;