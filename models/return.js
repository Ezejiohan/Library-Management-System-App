const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    loan_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', 
        required: true 
    },
    return_date: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const Return = mongoose.model('returns', returnSchema);
module.exports = Return;
