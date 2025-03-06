const express = require('express');

const { login, changeSuperAdminPassword } = require('../controllers/superAdmin');
const { authenticateUser } = require('../middlewares/authentication');

const superAdminRoute = express.Router();


superAdminRoute.post('/login', login);
superAdminRoute.put('/ChangeSuperAdminPassword', authenticateUser, changeSuperAdminPassword);

module.exports = superAdminRoute;
