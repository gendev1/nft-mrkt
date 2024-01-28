const axios = require("axios");
const { ethers } = require("ethers");

async function fetchNFTDetails(nftContractAddress, contractABI, provider) {
  // Initialize the contract
  const nftContract = new ethers.Contract(nftContractAddress, contractABI, provider);

  try {
    // Call the detailsUri function
    const detailsUri = await nftContract.detailsUri();

    // Fetch the NFT details from the URI
    const response = await axios.get(detailsUri);
    return response.data; // This should be in the NFT schema format
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    throw error;
  }
}

module.exports = fetchNFTDetails;
