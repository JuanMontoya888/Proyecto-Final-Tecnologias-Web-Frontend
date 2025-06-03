const express = require('express');
const router = express.Router();
const cors = require('cors');
const admin = require('../firebase');

//Inicializar y obtener referencia al servicio de authentication de firebase
const db = admin.firestore();


router.post('/login', (req, res) => {
    //Guardamos las credenciales que son recibidas
    const { uid } = req.body;
    let admins;


    // Con 'db' mandamos llamar cualquier elemento de la base de datos
    // estos estan organizados por colecciones, y de ahi por documentos
    db.collection('users').get().then(data => {
        if (data.empty) {
            console.log("No hay usuarios en la colección.");
        } else {
            admins = [];
            data.forEach(doc => admins.push(doc.data().data));
            console.log(admins);
        }


        // De los datos obtenidos de la bd buscamos los que coincidan con las credenciales
        const found = admins.find((u) => u.UID === uid ) || null;

        //por ultimo enviamos una respuesta al cliente
        res.json({ user: found });
    });

});

router.post('/createUser', (req, res) => {
    //const { UID, authMethod, name, username } = req.body;
    const data = req.body;


    try {
        db.collection('users').add(data).then((result) => {
            res.status(200).json({ ok: true, message: 'Was created successfully' });
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;