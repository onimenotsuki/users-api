const express = require('express');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  const { firstName, lastName, address, age } = req.body;

  const docRef = db.collection('users').doc(uuidv4());

  const setAda = docRef.set({
    firstName, lastName, address, age,
  });

  res
    .status(200)
    .json({
      status: 200,
      message: 'Created user successfuly',
      user: {
        firstName, lastName, address, age,
      },
    });
});

// app.get('/users', (req, res) => {
//   const users = db.collection('users').get();
//   let arr = [];

//   users.then((querySnapshot) => {
//     querySnapshot.forEach((doc, index) => {
//       // doc.data() is never undefined for query doc snapshots
//       // console.log(doc.data());

//       arr.push(doc.data());
//     });
//   });

//   res.status(200).json({
//     status: 200,
//     users: arr,
//   });
// });

app.listen(3000, () => console.log('Server mounted in: http://localhost:3000'));
