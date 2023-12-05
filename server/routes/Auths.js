const express = require("express");
const AuthController = require("../controllers/AuthController.js");
const router = express.Router();
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const isLoggedIn = require("../middlewares/isLoggedIn");

// # signup
router.post("/signup", asyncErrorHandler(AuthController.userSignUp));
// # login
router.post("/login", asyncErrorHandler(AuthController.userLogin));
// # logout
router.post("/logout", asyncErrorHandler(AuthController.userLogout));
// # forgotpassword
router.post(
  "/forgotpassword",
  asyncErrorHandler(AuthController.forgotPassword)
);
// # reset password
router.post(
  "/password/reset/:token",
  asyncErrorHandler(AuthController.resetPassword)
);
// # get logged in user details
router.post(
  "/user",
  isLoggedIn,
  asyncErrorHandler(AuthController.getLoggedInUserDetails)
);
// # update password
router.post(
  "/password/update",
  isLoggedIn,
  asyncErrorHandler(AuthController.updateLoggedInUserPassword)
);
// # update user details
router.post(
  "/user/update",
  isLoggedIn,
  asyncErrorHandler(AuthController.updateUser)
);

/*
    /userSignUp
    /login
    /logout
    /forgot password
    /password/reset/:token
    /user
    password/update
    /user/update
*/
module.exports = router;
