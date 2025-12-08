const Listing = require("./models/listing");
const expressError = require("./utils/expressError.js");
const{listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirect url save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =async (req,res,next)=>{
   let { id } = req.params;
   let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","Access Denied");
   return  res.redirect(`/listings/${listing._id}`);
  }

  next();
};

module.exports.isReviewAuthor = async(req,res,next) =>{
  const{id,reviewId} = req.params;
  const review = await Review.findById(reviewId);

  if(!review){
    req.flash("error","Review not found!");
    return res.redirect(`listings/${id}`);
  }
   if (!review.author || review.author.toString() !== res.locals.currentUser._id.toString()) {
    req.flash("error","Access Denied — you cannot delete someone else's review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req,res,next) =>{
     const data = req.body.listing ? req.body.listing : req.body;
     const { error } = listingSchema.validate(req.body);
   if(error){
    const errMsg = error.details.map((el)=>el.message).join(",")
    throw new expressError(400,errMsg);
}else{
  req.body.listing = { ...data };
    next();
} 
};

module.exports.validateReview = (req,res,next) =>{
     let {error} =  reviewSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",")
    throw new expressError(400,errMsg);
}else{
    next();
} 
}




