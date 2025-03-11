const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
         type: String, 
         required: true, 
         trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true, 
        unique: true 
    },
    role: { 
        type: String, 
        enum: ['super_admin', 'admin', 'librarian', 'borrower'], 
        default: 'borrower' 
    },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);
module.exports = User;
