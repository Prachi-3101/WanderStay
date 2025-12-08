const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;
const Review = require("./review.js");

const allowedCategories = [
  'anywhere',
  'amazing-pools',
  'beachfront',
  'cabins',
  'treehouses',
  'iconic-cities',
  'mountains',
  'skiing',
  'lakefront',
  'omg'
];


const listingSchema = new Schema(
  {
    title:{ 
        type: String,
            required: true,
    },
    description:  String,
    image: { 
       url: String,
       filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
         type: {
      type: String, 
      enum: ['Point'], 
    },
    coordinates: {
      type: [Number],
    }
  },
    category: { 
    type: String, 
    enum: allowedCategories,
    default: 'anywhere' 
  },
}, { timestamps: true });
listingSchema.index({ category: 1 });

listingSchema.post("findOneAndDelete", async function(listing) {
  if (!listing) return;
  const reviewIds = listing.reviews;
  await Review.deleteMany({ _id: { $in: reviewIds } });
});
const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing; 