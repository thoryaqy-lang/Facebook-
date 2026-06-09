const express = require("express");
const router = express.Router();
const { toggleLike } = require("../controllers/likeController");
const auth = require("../middleware/auth");

router.post("/toggle", auth, toggleLike);

module.exports = router;

