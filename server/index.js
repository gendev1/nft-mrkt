const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const ethers = require("ethers");
const marketplaceABI = require("./abi/NFTMarketplace.json");
const nftABI = require("./abi/MembershipNFT.json");
const indexInAlgolia = require("./utils/algoliaIndexer");
const NFT = require("./models/nftModel");
const Listing = require("./models/listingModel");
const fetchNFTDetails = require("./utils/fetchNFTDetails");

// Load env vars
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// routes
app.use("/api/v1", require("./routes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// event listener for new marketplace listing

const provider = new ethers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET, "matic");
const alchemyProvider = new ethers.AlchemyProvider("maticmum", process.env.ALCHEMY_KEY);
const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
const marketplaceContract = new ethers.Contract(contractAddress, marketplaceABI, provider);

marketplaceContract.on("Listed", async (listingId, sellerAddress, nftAddress, tokenId, price) => {
  const existingNFT = await NFT.findOne({ contractAddress: nftAddress, tokenId: tokenId });

  let newNFT = null;
  if (!existingNFT) {
    const nftDetails = await fetchNFTDetails(nftAddress, nftABI, alchemyProvider);

    newNFT = new NFT({ ...nftDetails, contractAddress: nftAddress });
    await newNFT.save();
  }

  // Save the listing
  const newListing = new Listing({
    listingId: listingId.toString(),
    sellerAddress: sellerAddress.toString(),
    nftAddress: nftAddress.toString(),
    tokenId: tokenId.toString(),
    price: price.toString(),
  });

  await newListing.save();
  await indexInAlgolia(newListing, newNFT);
});
