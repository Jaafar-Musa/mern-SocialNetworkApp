const express = require("express");
const router = express.Router();

//@route    GET api/profile
//@desc     Test route
//@access   Public (no auth required)
router.get("/", (req, res) => res.send("profile"));

module.exports = router;