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
      info: doc.data(),
      id: doc.id,
    }));
    res.status(200).json({
      status: 200,
      data,
    });
  } catch (err) {
    res.status(400).send('Error obteniendo documentos' + err);
  }

  // users.get()
  //   .then(snapshot => data = snapshot.docs)
  //   .catch(err => res.status(400).send('Error obteniendo documentos' + err));

  // res.json({ data });
});

app.listen(3000, () => console.log('Server running in port: 3000'));
