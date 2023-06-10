const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authorizeApi = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
      // Verify token and get user payload
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { authorizeApi };
