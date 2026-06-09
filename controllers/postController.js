const db = require("../config/db");

exports.createPost = async (req, res) => {
    try {

        const { content, user_id } = req.body;

        const image =
            req.file ? req.file.filename : null;

        await db.query(
            "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)",
            [user_id, content, image]
        );

        res.json({
            success: true,
            message: "تم إنشاء المنشور"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getFeed = async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT
                posts.*,
                users.first_name,
                users.last_name
            FROM posts
            LEFT JOIN users
                ON posts.user_id = users.id
            ORDER BY posts.id DESC
        `);

        for (const post of posts) {
            const [comments] = await db.query(`
                SELECT
                    comments.*,
                    users.first_name
                FROM comments
                LEFT JOIN users
                    ON comments.user_id = users.id
                WHERE comments.post_id = ?
                ORDER BY comments.id ASC
            `, [post.id]);

            post.comments = comments;
        }

        res.json(posts);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "خطأ في جلب المنشورات"
        });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { post_id, content } = req.body;

        await db.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [post_id, 1, content]
        );

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        await db.query(
            "DELETE FROM comments WHERE post_id = ?",
            [postId]
        );

        await db.query(
            "DELETE FROM posts WHERE id = ?",
            [postId]
        );

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false
        });
    }
};
exports.register = async (req, res) => {
    try {

        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;

        await db.query(
            `INSERT INTO users
            (first_name, last_name, email, password_hash)
            VALUES (?, ?, ?, ?)`,
            [
                first_name,
                last_name,
                email,
                password
            ]
        );

        res.json({
            success: true,
            message: "تم إنشاء الحساب"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const [users] = await db.query(
            `SELECT * FROM users
             WHERE email = ?
             AND password_hash = ?`,
            [email, password]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: "البريد أو كلمة المرور غير صحيحة"
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
