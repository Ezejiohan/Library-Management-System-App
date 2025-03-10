const Loan = require('../models/loan');

exports.fetchLoanById = (options) => {
    return Loan.findById(options)
};

exports.findLoan = async (options) => {
    return Loan.find(options)
}

