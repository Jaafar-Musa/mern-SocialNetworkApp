const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

//@route    GET api/auth
//@desc     Get user
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    //   console.log(req.user)
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);  
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route    POST api/auth
//@desc     Authenticate user and get token
//@access   Public (no auth required)
router.post(
  "/",
  [
    check("email", "Please include a valide email").isEmail(),
    check("password", "Please enter a password").exists(),
  ],
  async (req, res) => {
    //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //get the email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      //check if pass is corrext
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      //create and return jwt
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: config.get("jwtExpiresIn"),
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
