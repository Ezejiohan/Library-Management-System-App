const Loan = require('../models/loan');

exports.fetchLoanById = (options) => {
    return Loan.findById(options)
};

exports.findLoan = async (options) => {
    return Loan.find(options)
}

exports.fetchLoan = async (options) => {
    return await Loan.findOne(options)
};

exports.loanCountDocument = async (options) => {
    return await Loan.countDocuments(options)
}

exports.createLoan = async (options) => {
    return await Loan.create(options)
};
