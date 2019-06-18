const admin = require('firebase-admin');
const faker = require('faker');
const uuid = require('uuid/v4');
const serviceAccount= require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.populateUsers = (req, res) => {
  for (let i = 0; i < 10; i++) {
    const userRef = db.collection('users').doc(uuid());

    userRef.set({
      name: faker.name.findName(),
      address: faker.address.streetName() + ', ' + faker.address.streetAddress(),
      age: Math.floor(Math.random() * 35) + 15,
      username: faker.internet.userName(),
    });
  }

  res.send('Operación realizada con éxito');
  res.end();
};

exports.getUsers = async (req, res) => {
  const usersRef = db.collection('users');
  let users = [];

  try {
    const snapshot = await usersRef.get();

    snapshot.forEach(doc => users.push({
      info: doc.data(),
      id: doc.id,
    }));

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createUser = (req, res) => {
  const { name, age, address, username } = req.body;
  let docRef = db.collection('users').doc(uuid());

  docRef.set({
    name, age, address, username,
  });

  res.status(200).json({
    status:200,
    message:'created user successfuly',
    data: {
      name, age, address, username,
    },
  });
};

exports.getUser = async (req, res) => {
  const userRef = db.collection('users').doc(req.params.id);

  try {
    const user = await userRef.get();

    if (user.exists) {
      res.status(200).json({
        data: {
          info: user.data(),
          id: user.id,
        },
      });
    }

    res.status(400).send('El usuario: ' + user.id + ' no existe');
  } catch (error) {
    res.status(500).send('Error: ' + error);
  }
};

exports.deleteUser = async (req, res) => {
  const userRef = db.collection('users').doc(req.params.id);
  const userSnapshot = await userRef.get();

  if (userSnapshot.exists) {
    userRef.delete();

    res.status(200).send('Operación realizada con éxito');
  }

  res
    .status(400)
    .send('El usuario ' + userSnapshot.id + ' no existe en la base de datos');
};

exports.updateUser = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      userRef.update({
        name: req.body.name || userSnapshot.data().name,
        address: req.body.address || userSnapshot.data().address,
        age: req.body.age || userSnapshot.data().age,
        username: req.body.username || userSnapshot.data().username,
      });

      const updatedUser = await userRef.get();

      res.status(200).json({
        data: {
          info: updatedUser.data(),
          id: updatedUser.id,
        },
      });
    }
  } catch (error) {
    res.status(400).send("Error "+ error);
    res.end();
  }
};
