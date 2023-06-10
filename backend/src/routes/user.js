const express = require("express");
const router = express.Router();
const { getUsers, registerUser, loginUser } = require("../controllers");
const { authorizeApi  } = require('../middlewares');

router.get("/", authorizeApi, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
