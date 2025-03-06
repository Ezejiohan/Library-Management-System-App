const express = require('express');

const { signUpAdmin, login, deleteAdmin, getAllAdmins, adminProfile, getOneAdmin, changeAdminPassword } = require('../controllers/admin');
const { superAdminAuthorization } = require('../middlewares/superAdminAuth');
const { adminAuthorization } = require('../middlewares/adminAuth');

const route = express.Router();

route.post('/signUpAdmin', superAdminAuthorization, signUpAdmin);
route.post('/login', login);
route.get('/adminProfile', adminAuthorization, adminProfile);
route.delete('/deleteAdmins/:adminId', superAdminAuthorization, deleteAdmin);
route.put('/changeAdminPassword', adminAuthorization, changeAdminPassword);
route.get('/getAllAdmins', superAdminAuthorization, getAllAdmins);
route.get('/getOneAdmin/:adminId', superAdminAuthorization, getOneAdmin);

module.exports = route;
