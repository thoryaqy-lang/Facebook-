const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const postController = require("../controllers/postController");
const db = require("../config/db");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// جلب المنشورات
router.get("/feed", postController.getFeed);

router.post(
    "/register",
    postController.register
);
router.post(
    "/login",
    postController.login
);

// إنشاء منشور
router.post(
    "/create",
    upload.single("image"),
    postController.createPost
);
// إضافة تعليق
router.post("/comments", postController.addComment);

// حذف منشور
router.delete("/posts/:id", postController.deletePost);

// إعجاب
router.post("/like/:id", async (req, res) => {
try {
const postId = req.params.id;

await db.query(
"UPDATE posts SET likes = COALESCE(likes,0) + 1 WHERE id = ?",
[postId]
);

res.json({ success: true });

} catch (error) {
console.error(error);
res.status(500).json({
success: false,
message: "حدث خطأ"
});
}
});

router.get(
    "/profile/:id",
    postController.getProfile
);

router.post(
    "/profile/update",
    upload.single("profile_picture"),
    postController.updateProfile
);

module.exports = router;
