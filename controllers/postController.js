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
