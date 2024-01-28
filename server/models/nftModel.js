const mongoose = require("mongoose");

const TierSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  price: { type: String, default: "" }, // or Number if it's a numeric value
  duration: { type: String, default: "" }, // or Number if it's a numeric value
});

const NFTSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Symbol: { type: String, default: "" },
  description: { type: String, required: true },
  external_link: { type: String, required: true },
  image: { type: String, required: true },
  tiers: [TierSchema],
  contractAddress: { type: String, required: true },
});

const NFT = mongoose.model("NFT", NFTSchema);

module.exports = NFT;
