const express = require('express');
const router = express.Router();
const cors = require('cors');

//Crear el enlace a la base de datos
var admin = require("firebase-admin");
var serviceAccount = require("../firestore-key.json");
const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

//Inicializar y obtener referencia al servicio de authentication de firebase
const db = admin.firestore();

router.post('/login', (req, res) => {
    //Guardamos las credenciales que son recibidas
    const { uid } = req.body;
    let admins;

    console.log(uid);

    // Con 'db' mandamos llamar cualquier elemento de la base de datos
    // estos estan organizados por colecciones, y de ahi por documentos
    db.collection('users').get().then(data => {
        admins = data.docs.map(doc => doc.data());

        // console.log(admins);

        // Asignamos los datos que enviamos ocultos a este tipo de dato
        const { username, password } = req.body;
        // De los datos obtenidos de la bd buscamos los que coincidan con las credenciales
        const found = admins.find(u => u.UID === uid) || null;

        //     //por ultimo enviamos una respuesta al cliente
        res.json({ user: found });
    });

});
//llamamos a la base de datos para las reservas, en la coleccion reservas
// Endpoint para guardar reservaciones
router.post('/reservacion', async (req, res) => {
  try {
    const reservacion = req.body;
    const docRef = await db.collection('reservas').add({
      ...reservacion,
      createdAt: new Date()
    });
    res.status(200).json({ message: 'Reservación guardada en Firestore', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar: ' + error.message });
  }
});


module.exports = router;