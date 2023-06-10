const express = require("express");
const router = express.Router();
const { getImages, createImage, uploadImage } = require("../controllers");
const { authorizeApi  } = require('../middlewares');

router.route('/').get(authorizeApi, getImages).post(authorizeApi, createImage)
router.post("/upload",authorizeApi, uploadImage);

module.exports = router;
