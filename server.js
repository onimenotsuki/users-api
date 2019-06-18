const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Routes
const usersRoutes = require('./routes/users.routes');

// Vendor midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use('/users', usersRoutes);

app.listen(3000, () => console.log('Server running in port: 3000'));
