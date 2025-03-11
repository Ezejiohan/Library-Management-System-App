const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    book_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    loan_date: { 
        type: Date, 
        default: Date.now 
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'returned', 'overdue'], 
        default: 'active' 
    }
}, { timestamps: true });

const Loan = mongoose.model('loans', loanSchema);
module.exports = Loan;
