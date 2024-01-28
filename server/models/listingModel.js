const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  listingId: String,
  sellerAddress: String,
  nftAddress: String,
  tokenId: String,
  price: String, // or Number, if it's a numeric value
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
