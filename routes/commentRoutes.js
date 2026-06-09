const express = require("express");
const router = express.Router();
const { addComment, getComments } = require("../controllers/commentController");
const auth = require("../middleware/auth");

router.post("/add", auth, addComment);
router.get("/:post_id", getComments);

module.exports = router;

