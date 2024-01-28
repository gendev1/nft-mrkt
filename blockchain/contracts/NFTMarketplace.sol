// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;
    uint256 private _listingIdCounter;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price
    );
    event Sale(uint256 indexed listingId, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId);

    constructor() Ownable(msg.sender) {}

    // List an NFT
    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        uint256 listingId = _listingIdCounter++;
        listings[listingId] = Listing(
            msg.sender,
            nftAddress,
            tokenId,
            price,
            true
        );

        emit Listed(listingId, msg.sender, nftAddress, tokenId, price);
    }

    // Buy a listed NFT
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(msg.value == listing.price, "Incorrect price sent");

        listing.isActive = false;
        IERC721(listing.nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );
        payable(listing.seller).transfer(msg.value);

        emit Sale(listingId, msg.sender, msg.value);
    }

    // Cancel a listing
    function cancelListing(uint256 listingId) public nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        listing.isActive = false;

        emit ListingCancelled(listingId);
    }
}
