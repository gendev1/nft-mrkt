const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
dotenv.config();

const ALGOLIA_KEY = process.env.ALGOLIA_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_KEY);
const nftIndex = client.initIndex("nfts");
const listingIndex = client.initIndex("listings");

async function indexInAlgolia(listing = { _id: "123", test: "test" }, nft = { _id: "123", test: "test" }) {
  try {
    if (nft) {
      await nftIndex.saveObject({
        objectID: nft._id,
        ...nft.toObject(),
      });
    }
    await listingIndex.saveObject({
      objectID: listing._id,
      ...listing.toObject(),
    });
  } catch (error) {
    console.error("Error indexing data in Algolia:", error);
    throw error;
  }
}

module.exports = indexInAlgolia;
