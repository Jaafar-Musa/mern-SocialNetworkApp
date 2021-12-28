const express = require("express");
const router = express.Router();

//@route    GET api/posts
//@desc     Test route
//@access   Public (no auth required)
router.get("/", (req, res) => res.send("posts"));

module.exports = router;