const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");




//index route
router.get("/",wrapAsync(async(req,res)=>{
  const allListings =  await Listing.find({});
  res.render(`./listings/index.ejs`,{allListings});
}));



//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
      path: "reviews",
      populate: {path: "author"}
   })
   .populate("owner");
   if(!listing){
     req.flash("error", "Listing not found!");
    return res.redirect("/listings");
   }
   res.render(`./listings/show.ejs`,{listing});
}));

//create route
router.post("/", isLoggedIn,validateListing,
    wrapAsync(async(req,res,next)=>{
   let result =  listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
    throw new expressError(400,result.error);
   }
        const newListing =   new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","Your listing has been created successfully!");
        res.redirect(`/listings`);
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new expressError(400, "Send valid data for listing");
  }

  let { id } = req.params;
   let listings = await Listing.findById(id);
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","Access Denied");
   return  res.redirect(`/listings/${listing._id}`);
  }
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
}));


//destroy route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("Hi");
    req.flash("success","Listing deleted successfully!");
    res.redirect("./");
}));

module.exports = router;
