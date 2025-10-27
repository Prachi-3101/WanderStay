const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let{username,email,password} = req.body;
   const newUser = new User({ email, username });
   const registeredUser = await User.register(newUser,password);
   console.log(registeredUser);
   req.flash("success", "Welcome to the WanderStay family!");
   res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back, wanderer!");
    res.redirect("/listings");
  }
);

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You’ve logged out — see you on your next trip!");
    res.redirect("/listings");
  })
})

module.exports = router;