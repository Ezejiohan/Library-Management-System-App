const Book = require('../models/book');

exports.fetchBook = async (options) => {
    return await Book.findOne(options)
};

exports.createBook = async (options) => {
    return await Book.create(options)
};

exports.fetchBookById = (options) => {
    return Book.findById(options)
};

exports.deleteBook = async (options) => {
    return Book.deleteOne(options)
}
