
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser, createUser, fetchUserById, deleteUser, findUser } = require('../repository/user');
const { sendEmail } = require('../utilities/nodemailer');

exports.signUpAdmin = async (req, res) => {
    try {
        const { fullname, email, password, role, phone } = req.body;

        const existingAdmin = await fetchUser({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, saltPassword);

        const admin = await createUser({
            fullname,
            email,
            password: hashPassword,
            phone,
            role
        });

        res.status(201).json({ message: 'Admin registered successfully', admin });
    
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
    
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await fetchUser({ email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const checkMatch = await bcrypt.compare(password, user.password);

    if (!checkMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const generatedToken = jwt.sign({
        userId: user._id,
        role: user.role
    },
    process.env.TOKEN, { expiresIn: process.env.LOGIN_TOKEN_EXPIRY });

    const result = {
        userId: user._id,
        email: user.email,
        token: generatedToken,
    };

    return res.status(200).json({ message: "Successfully login", result });
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;
        

        const user = await fetchUserById(userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied: admin can change password" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(404).json({ error: "Password incorrect" });
        }

        if (newPassword === oldPassword) {
            return res.status(403).json({ message: "New password must be different from the old password" })
        }

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

        user.password = hashPassword;
        await user.save();

        sendEmail({
            email: user.email,
            subject: "Password change alert",
            message: "You have changed your password. If not you alert us"
        });

        const result = {
            fullname: user.fullname,
            email: user.email
        }

        return res.status(200).json({ result, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await fetchUserById(adminId);
        if (admin.role !== 'admin') {
            return res.status(404).json({ error: "Admin not found" });
        } else {
            await deleteUser({adminId});
            res.status(200).json({
                message: "Admin deleted successfully"
            });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.adminProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await fetchUserById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const user = await fetchUserById(req.user.userId);

        const allAdmins = await findUser({ role: 'admin' });

        res.status(200).json({ message: "Admins retrieved successfully", numberOfAdmins: allAdmins.length, allAdmins });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await fetchUserById(adminId);
        if (admin.role !== 'admin') {
            return res.status(400).json({ error: "Admin not found" });
        }
        res.status(200).json({ message: "Admin retrieved successfully", admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
