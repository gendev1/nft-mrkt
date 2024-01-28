//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "./Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MembershipNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    struct Tier {
        uint256 price;
        uint256 duration;
    }

    struct MintDetails {
        uint256 tierId;
        uint256 expiry;
    }

    Counters.Counter private _tokenIds;

    Tier[] public tiers;
    mapping(uint256 => MintDetails) public mintDetails;
    string public detailsUri;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _detailsUri
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        detailsUri = _detailsUri;
    }

    function setDetailsUri(string memory _detailsUri) public onlyOwner {
        detailsUri = _detailsUri;
        emit NFTDetailsUpdated(_detailsUri);
    }

    function mint(uint256 tierIndex) public payable nonReentrant onlyOwner {
        require(tierIndex < tiers.length, "Invalid tier index");
        Tier storage tier = tiers[tierIndex];
        require(msg.value == tier.price, "Incorrect price");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);

        mintDetails[newTokenId] = MintDetails(
            tierIndex,
            block.timestamp + (tier.duration * 1 days)
        );
        emit SubscriptionMinted(newTokenId, mintDetails[newTokenId].expiry);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return detailsUri;
    }

    function isSubscriptionActive(uint256 tokenId) public view returns (bool) {
        require(tokenExists(tokenId), "Token does not exist"); // Direct call to _exists
        MintDetails storage details = mintDetails[tokenId];
        return block.timestamp < details.expiry;
    }

    // Override transferFrom
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(isSubscriptionActive(tokenId), "Subscription is not active");
        super.transferFrom(from, to, tokenId);
    }

    // Override safeTransferFrom
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(isSubscriptionActive(tokenId), "Subscription is not active");
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    // Function to renew subscription
    function renewSubscription(uint256 tokenId) public payable {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        MintDetails storage details = mintDetails[tokenId];
        Tier storage tier = tiers[details.tierId];
        require(msg.value == tier.price, "Incorrect renewal price");

        details.expiry += tier.duration * 1 days;
        emit SubscriptionRenewed(tokenId, details.expiry);
    }

    function addTier(uint256 price, uint256 duration) public onlyOwner {
        tiers.push(Tier(price, duration));
        emit TierAdded(price, duration);
    }

    function batchAddTier(
        uint256[] memory prices,
        uint256[] memory durations
    ) public onlyOwner {
        require(prices.length == durations.length, "Invalid input");
        for (uint256 i = 0; i < prices.length; i++) {
            tiers.push(Tier(prices[i], durations[i]));
            emit TierAdded(prices[i], durations[i]);
        }
    }

    function updateTier(
        uint256 index,
        uint256 price,
        uint256 duration
    ) public onlyOwner {
        require(index < tiers.length, "Invalid tier index");
        Tier storage tier = tiers[index];
        tier.price = price;
        tier.duration = duration;
        emit TierUpdated(index, price, duration);
    }

    function removeTier(uint256 index) public onlyOwner {
        require(index < tiers.length, "Invalid tier index");
        delete tiers[index];
        emit TierRemoved(index);
    }

    // Function to manually check if a token exists
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    event TierAdded(uint256 price, uint256 duration);
    event TierUpdated(uint256 index, uint256 price, uint256 duration);
    event TierRemoved(uint256 index);
    event NFTDetailsUpdated(string nftDetailsIPFSHash);
    event SubscriptionRenewed(uint256 tokenId, uint256 expiry);
    event SubscriptionMinted(uint256 tokenId, uint256 expiry);
    event SubscriptionTransferred(uint256 tokenId, uint256 expiry);
}
