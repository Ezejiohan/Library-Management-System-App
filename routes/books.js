const express = require('express');

const { createBook, deleteBooks, getAllBooks, getOneBook } = require('../controllers/book');
const { adminAuthorization } = require('../middlewares/adminAuth');
const { authenticateUser } = require('../middlewares/authentication');

const bookRoute = express.Router();

bookRoute.post('/create', adminAuthorization, createBook);
bookRoute.delete('/delete/:bookId', adminAuthorization, deleteBooks);
bookRoute.get('/allBooks', authenticateUser, getAllBooks);
bookRoute.get('/getBook', authenticateUser, getOneBook);

module.exports = bookRoute;
