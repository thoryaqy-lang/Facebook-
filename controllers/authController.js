const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (first_name, last_name, email, password_hash) VALUES(?,?,?,?)",
            [first_name, last_name, email, hashedPassword]);
        res.json({ success: true, message: "Account Created" });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (users.length === 0) return res.status(404).json({ message: "User Not Found" });

        const valid = await bcrypt.compare(password, users[0].password_hash);
        if (!valid) return res.status(401).json({ message: "Wrong Password" });

        const token = jwt.sign({ id: users[0].id, email: users[0].email }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.json({ token, user: users[0] });
    } catch (error) {
        res.status(500).json(error);
    }
};

