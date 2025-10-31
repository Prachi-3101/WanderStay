const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderStay";

main().then(()=>{
    console.log("connected to DataBase");
}).catch(err=>{
    console.log(err);
});
async function main() {
    await mongoose.connect (MONGO_URL) ; 
}

const initDb = async()=>{
   await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "69024b772e980566be75f593"}));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
}

initDb();