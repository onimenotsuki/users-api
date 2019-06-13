const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid/v4');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  // const name = req.body.name;
  // const age = req.body.age;
  const { name, age } = req.body;

  let docRef = db.collection('users').doc(uuid());

  const docData = docRef.set({
    name, age,
  });

  // res.status(200).send('Hola ' + name);
  res.status(200).json({
    status: 200,
    message: 'Petición realizada con éxito',
    data: {
      name, age,
      // name: name,
      // age: age,
    },
  });
});

app.get('/users', async (req, res) => {
  const usersRef = db.collection('users');
  let data = [];

  try {
    let snapshot = await usersRef.get();
    snapshot.forEach(doc => data.push({
      id: doc.id,
      info: doc.data(),
    }));
    res.status(200).json({
      status: 200,
      data,
    });
  } catch (err) {
    res.status(400).send('Error obteniendo documentos' + err);
  }
});

app.get('/users/:id', async (req, res) => {
  const userRef = db.collection('users').doc(req.params.id);

  try {
    let doc = await userRef.get();

    if (doc.exists) {
      res.status(200).json({
        status: 200,
        data: {
          id: doc.id,
          info: doc.data(),
        },
      });
    }

    res.status(400).json({
      status: 400,
      message: `El documento: ${doc.id} no existe en la base de datos`,
    });
  } catch (err) {
    res.status(500).send('Error obteniendo el documento ' + req.params.id);
  }
})

app.delete('/users/:id', async (req, res) => {
  const docRef = db.collection('users').doc(req.params.id);
  const doc = await docRef.get();

  if (doc.exists) {
    docRef.delete();
    res.status(200).send('Documento eliminado');
    res.end();
  }

  res.status(400).send(`El documento: ${docRef.id} no existe en la Base de Datos`);
  res.end();
});

app.listen(3000, () => console.log('Server running in port: 3000'));
