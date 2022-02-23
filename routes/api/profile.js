const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const normalizer = require("normalize-url")

//@route    GET api/profile/me
//@desc     Get current user profile
//@access   Private (auth required)
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user" });
    }

    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("server error");
  }
});

//@route    GET api/profile
//@desc     return all profiles
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    let profiles = await Profile.find();
  } catch (e) {
    console.error(e.message);
    res.status(500).send("server error");
  }
});

//@route    POST api/profiles
//@desc     Update profile
//@access   Private
router.post(
  "/",
  [
    auth,
    [check("status", "status is required").notEmpty(),
    check("skills", "status is required").notEmpty(),]
  ],
  async (req, res) => {
    try {
        //handle validation
      let errors = validationResult(req); 
      if(!errors.isEmpty()){
          res.status(400).json({errors:errors.array(), })
      }

      const {
        website,
        youtube,
        skills,
        ...rest
      } = req.body

      // build Profile 
      const profileFields = {
        user:req.user.id,
        website: website && website !== "" ?
        normalizer(website, {forceHttps:true}) :"",
        skills: Array.isArray(skills) ?
        skills : skills.split(",").map(skill => skill.trim())
      }

      console.log(profileFields, youtube)

      // let profile = new Profile()




      res.status(201).send("Content added")
    } catch (e) {
      console.error(e.message);
      res.status(500).send("server error");
    }
  }
);


module.exports = router;
