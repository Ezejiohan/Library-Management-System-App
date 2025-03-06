const User = require('../models/user');

exports.fetchUser = async (options) => {
    return await User.findOne(options)
};

exports.createUser = async (options) => {
    return await User.create(options)
};

exports.fetchUserById = (options) => {
    return User.findById(options)
};

exports.updateUser= async (options) => {
    return User.findByIdAndUpdate(options)
}

exports.deleteUser = async (options) => {
    return User.deleteOne(options)
}

exports.findUser = async (options) => {
    return User.find(options)
}
