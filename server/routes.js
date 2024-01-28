const express = require("express");
const router = express.Router();
const Listing = require("./models/listingModel");
const NFT = require("./models/nftModel"); // Add your NFT model

// health check
router.get("/health", (req, res) => {
  res.json({ status: "API server is working great!!!" });
});

// Route to get all listings with NFT names
router.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find({}).lean();
    for (let listing of listings) {
      const nft = await NFT.findOne({ contractAddress: listing.nftAddress }).lean();
      if (nft) {
        listing.nftName = nft.name;
        listing.nftImageUrl = nft.image; // Assuming imageUrl is the field in your NFT model
      } else {
        listing.nftName = "NFT not found";
        listing.nftImageUrl = null;
      }
    }
    res.json(listings);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get a specific listing and its corresponding NFT details
router.get("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findOne({ listingId: req.params.id });
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    const nft = await NFT.findOne({ contractAddress: listing.nftAddress });
    if (!nft) {
      return res.status(404).send("NFT not found");
    }

    res.json({ listing, nft });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/listings/ids", async (req, res) => {
  try {
    const { listingIds } = req.body;
    console.log("listingIds", listingIds);
    console.log("JSON.parse(listingIds)", JSON.parse(listingIds));
    const listings = await Listing.find({ listingId: { $in: JSON.parse(listingIds) } });

    if (!listings || listings.length === 0) {
      return res.status(404).json({ message: "No listings found for the provided IDs" });
    }

    // Create an array to store the results
    const results = [];

    // Iterate through the matching listings and fetch NFT details
    for (let listing of listings) {
      const nft = await NFT.findOne({ contractAddress: listing.nftAddress }).lean();
      console.log(nft);
      let listingObj = listing.toObject(); // Convert listing to a plain JavaScript object
      if (nft) {
        listingObj.nftName = nft.name;
        listingObj.nftImageUrl = nft.image; // Assuming imageUrl is the field in your NFT model
      } else {
        listingObj.nftName = "NFT not found";
        listingObj.nftImageUrl = null;
      }
      results.push(listingObj);
    }
    console.log(results);
    // Return the matching listings with NFT details
    res.json(results);
  } catch (error) {
    console.error("Error fetching listings by IDs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
