const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    isbn: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: String, 
        enum: ['available', 'borrowed', 'lost'], 
        default: 'available' 
    }
}, { timestamps: true });

const Book = mongoose.model('books', bookSchema);
module.exports = Book;
