const express = require('express');

const { createBook, deleteBooks } = require('../controllers/book');
const { adminAuthorization } = require('../middlewares/adminAuth');

const bookRoute = express.Router();

bookRoute.post('/create', adminAuthorization, createBook);
bookRoute.delete('/delete/:bookId', adminAuthorization, deleteBooks);

module.exports = bookRoute;
