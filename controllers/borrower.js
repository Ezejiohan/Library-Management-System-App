
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser, createUser, fetchUserById, updateUser, findUser } = require('../repository/user');
const { fetchBookById } = require('../repository/book');
const { sendEmail } = require('../utilities/nodemailer');
const { fetchLoan, loanCountDocument, createLoan } = require('../repository/loan');

exports.signUp = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;

        const existingUser = await fetchUser({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            fullname,
            email,
            password: hashedPassword,
            phone,
            role: 'borrower'
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully as borrower', user });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await fetchUser({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const checkMatch = await bcrypt.compare(password, user.password);

    if (!checkMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
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

    return res.status(200).json({ result });
};

exports.borrowerProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.changeBorrowerPassword = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { oldPassword, newPassword } = req.body;

        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Password incorrect" });
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

exports.borrowerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await fetchUser({ email });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.TOKEN, { expiresIn: "30mins" });

        const passwordChangeLink = `${req.protocol}://${req.get("host")}/user/resetPassword/${user._id}/${token}`;
        const message = `Click this link: ${passwordChangeLink} to set a new password`;

        sendEmail({
            email: user.email,
            subject: 'Forget password link',
            message: message
        });

        res.status(200).json({
            message: "Email has sent"
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.resetBorrowerPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN);
        const userId = decoded.userId;

        const user = await fetchUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await jwt.verify(token, process.env.TOKEN)

        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                message: 'There is a difference in both password'
            });
        }

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

        user.password = hashPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.getAllBorrowers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await fetchUserById(userId);

        if (user.role !== 'super_admin') {
            return res.status(403).json({ message: "Access denied: Only super_admin can view all borrowers" });
        }

        const allBorrowers = await findUser({ role: 'borrower' });

        res.status(200).json({ message: "Borrowers retrieved successfully", numberOfBorrowers: allBorrowers.length, allBorrowers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.adminGetAllBorrowers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await fetchUserById(userId);

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied: Only admin can view all borrowers" });
        }

        const allBorrowers = await findUser({ role: 'borrower' });

        res.status(200).json({ message: "Borrowers retrieved successfully", numberOfBorrowers: allBorrowers.length, allBorrowers});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loanBook = async (req, res) => {
    try {
        const { book_id, due_date } = req.body;
        const user_id = req.user.userId;

        const book = await fetchBookById(book_id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const user = await fetchUserById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingLoan = await fetchLoan({ book_id, user_id, status: 'active' });
        if (existingLoan) {
            return res.status(400).json({ message: "You have already borrowed this book and not returned it." });
        }

        const activeLoans = await loanCountDocument({ user_id, status: 'active' });
        if (activeLoans >= 3) {
            return res.status(400).json({ message: "Loan limit reached. Please return a book before borrowing a new one." });
        }

        const newLoan = await createLoan({
            book_id,
            user_id,
            due_date
        });

        res.status(201).json({ message: "Book successfully borrowed", loan: newLoan });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
