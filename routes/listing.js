const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const{listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next) =>{
     let {error} =  listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",")
    throw new expressError(400,errMsg);
}else{
    next();
} 
};

//index route
router.get("/",wrapAsync(async(req,res)=>{
  const allListings =  await Listing.find({});
  res.render(`./listings/index.ejs`,{allListings});
}));



//new route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   res.render(`./listings/show.ejs`,{listing});
}));

//create route
router.post("/", validateListing,
    wrapAsync(async(req,res,next)=>{
   let result =  listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
    throw new expressError(400,result.error);
   }
        const newListing =   new Listing(req.body.listing);
        await newListing.save();
        req.flash("Success","Your listing has been created successfully!");
        res.redirect(`/listings`);
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success","Listing Updated");
  res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id",validateListing,
    wrapAsync (async(req,res)=>{
    if(!req.body.listing){
        throw new expressError(400,"Send Valid Data For Listing");
    }
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//destroy route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("Hi");
    req.flash("success","Listing deleted successfully!");
    res.redirect("./");
}));

module.exports = router;
