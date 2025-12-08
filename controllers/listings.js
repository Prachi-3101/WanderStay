const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


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

module.exports.create = async (req, res, next) => {
  try {
    const locationQuery = req.body?.listing?.location;
    if (!locationQuery) {
      req.flash("error", "Please provide a location for the listing.");
      return res.redirect("/listings/new");
    }

    const geocodeRes = await geocodingClient
      .forwardGeocode({
        query: locationQuery,
        limit: 1
      })
      .send();

    const features = geocodeRes.body && geocodeRes.body.features;
    if (!features || !features.length) {
      req.flash("error", "Could not find that location. Try a different one.");
      return res.redirect("/listings/new");
    }
    let result = listingSchema.validate(req.body);
    if (result.error) {
      return next(new expressError(400, result.error));
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    newListing.geometry = features[0].geometry;

    const savedListing = await newListing.save();
    req.flash("success", "Your listing has been created successfully!");
    res.redirect(`/listings/${savedListing._id}`);
  } catch (err) {
    next(err);
  }
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
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file != "undefined"){
      let url = req.file.path;
      let filename= req.file.filename;
      listing.image = {url,filename};
      await listing.save();
  }
   
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