const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchuser");

const JWT_SECRET = "Sulavisagoodb$oy";

//ROUTE 1 : Create a user using: POST "/api/auth/createuser" . Doesnot require Auth
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Name cannot be less than 3 letters").isLength({ min: 3 }),
    body("password", "Password cannot be less than 4 characters").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        }, 
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internal Server Error");
    }
  }
);

//ROUTE 2 : Authenticate a user using: POST "/api/auth/login" .
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "Please try to login with correst credentials." });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success, error: "Please try to login with correst credentials." });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error.");
    }
  }
);

// ROUTE 3 : Get logged in user details using POST: "/api/auth/getuser".
router.post("/getuser", fetchUser, async (req, res) => {
  let success = false
  try {
    let userId = req.user.id;
    const user = await User.findById(userId);
    success = true
    res.send({success, user});
  } catch (error) {
    console.error(error.message);
    res.status(500).send(success, "Internal Server Error.").select("-password");
  }
});

module.exports = router;
