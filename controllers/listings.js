const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
  const allListings =  await Listing.find({});
  res.render(`./listings/index.ejs`,{allListings});
};

module.exports.new = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.show = async(req,res)=>{
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
};

module.exports.create = async(req,res,next)=>{
   let url = req.file.path;
  let filename= req.file.filename;
   let result =  listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
    throw new expressError(400,result.error);
   }
        const newListing =   new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","Your listing has been created successfully!");
        res.redirect(`/listings`);
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
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
};

module.exports.delete = async(req,res)=>{
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    console.log("Hi");
    req.flash("success","Listing deleted successfully!");
    res.redirect("./");
};