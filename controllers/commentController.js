const db = require("../config/db"); // تأكد من مسار قاعدة البيانات لديك

exports.addComment = async (req, res) => {
    const { post_id, content } = req.body;
    const user_id = req.user.id;
    try {
        await db.execute("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [post_id, user_id, content]);
        res.json({ message: "Comment added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    const { post_id } = req.params;
    try {
        const [comments] = await db.execute("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC", [post_id]);
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

