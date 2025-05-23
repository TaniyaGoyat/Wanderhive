const express=require("express");
const router=express.Router({mergeParams:true});
const User= require("../models/user.js");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const userController= require("../controllers/users.js");

router.get("/signup",userController.renderSignupForm)

router.post("/signup", userController.signup);

router.get("/login",userController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local",{                                    // authentication of the user trying to login by passport
    failureRedirect: "/login"  , 
    failureFlash: true
}),userController.login);

router.get("/logout",userController.logout);


module.exports= router;