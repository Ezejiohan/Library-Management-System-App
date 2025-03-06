const express = require("express");

const route = require('./routes/admins');
const borrowerRoute = require('./routes/borrowers');
const superAdminRoute = require('./routes/superAdmins');
const bookRoute = require('./routes/books');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/admins', route);
app.use('/borrowers', borrowerRoute);
app.use('/superAdmins', superAdminRoute);
app.use('/books', bookRoute);

module.exports = app;
