const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    author_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Author', 
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

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
