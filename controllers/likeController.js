const db = require("../config/db");

exports.toggleLike = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user.id;
    try {
        // التحقق هل وضع إعجاباً من قبل؟
        const [existing] = await db.execute("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id]);
        if (existing.length > 0) {
            await db.execute("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id]);
            res.json({ message: "Like removed" });
        } else {
            await db.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [post_id, user_id]);
            res.json({ message: "Like added" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

