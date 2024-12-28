const express=require("express");
const { registerUser, loginUser, logoutUser, forgotPass, resetPassword, loadUser, verifyEmail } = require("../controller/userController");
const { isAuthenticated } = require("../middleware/auth");

const router=express.Router();

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/forgotPass").post(forgotPass)
router.route("/resetPass/:token").post(resetPassword)
router.route("/me").get(isAuthenticated, loadUser);

module.exports=router;