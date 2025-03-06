const express = require('express');

const { signUp, login, borrowerProfile, changeBorrowerPassword, borrowerForgotPassword, resetBorrowerPassword, getAllBorrowers, adminGetAllBorrowers} = require('../controllers/borrower');
const { authenticateUser } = require('../middlewares/authentication');

const borrowerRoute = express.Router();

borrowerRoute.post('/signUp', signUp);
borrowerRoute.post('/login', login);
borrowerRoute.get('/borrowerProfile', authenticateUser, borrowerProfile);
borrowerRoute.put('/borrowerChangePassword', authenticateUser, changeBorrowerPassword);
borrowerRoute.post('/borrowerForgotPassword', borrowerForgotPassword);
borrowerRoute.patch('/resetBorrowerPassword/:token', resetBorrowerPassword);
borrowerRoute.get('/getAllBorrowers', authenticateUser, getAllBorrowers);
borrowerRoute.get('/adminGetAllBorrowers', authenticateUser, adminGetAllBorrowers);

module.exports = borrowerRoute;
