
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser, fetchUserById } = require('../repository/user');
const {sendEmail} = require('../utiilies/nodemailer');



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
    process.env.TOKEN, { expiresIn: process.env.LOGIN_TOKEN_EXPIRY});
    const result = {
        userId: user._id,
        email: user.email,
        token: generatedToken,
    };

    return res.status(200).json({ result });
};

exports.changeSuperAdminPassword = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { oldPassword, newPassword } = req.body;

        const user = await fetchUserById(userId);
        if (user.role !== 'super_admin') {
            return res.status(403).json({ error: "Access denied: Only super_admin can change password" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(404).json({ error: "Password incorrect" });
        }

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

        if (newPassword === oldPassword) {
            return res.status(403).json({ message: "Unauthorised" })
        }

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
