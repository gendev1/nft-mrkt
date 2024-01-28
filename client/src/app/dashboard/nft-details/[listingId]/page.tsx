"use client";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import marketplaceAbi from "@/contracts/NFTMarketplace.json";
import nftAbi from "@/contracts/MembershipNFT.json";
import { marketplaceAddress, membershipNFTAddress } from "@/contracts/deployedAddress";
import { useWriteContract } from "wagmi";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { parseEther } from "viem";

export default function NFTDetails() {
  const [details, setDetails] = useState({ listing: { price: 0 }, nft: null });
  const { writeContract } = useWriteContract();
  const shrinkWalletAddress = (walletAddress: string) => {
    return walletAddress.slice(0, 2) + "..." + walletAddress.slice(-4);
  };

  const listingId = useParams()?.listingId;

  const handleBuyNFT = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      console.log("buying nft");
      console.log("listingId", listingId);
      console.log("test", BigInt(details.listing.price));
      // Ensure listingId is in the correct format (e.g., a number or BigNumber)

      const formattedListingId = BigInt(listingId as string);
      console.log("formattedListingId", formattedListingId);
      // Convert the ETH value to the appropriate format
      // const formattedValue = new BigNumber(details.listing.price.toString() as string);
      // const valueInWei = parseEther(details.listing.price.toString() as string);
      const valueInWei = ethers.parseUnits(details.listing.price.toString() as string, "wei");
      // const result = await writeContract({
      //   abi: marketplaceAbi,
      //   address: marketplaceAddress, // Assuming the address is in the config
      //   functionName: "buyNFT",
      //   args: [formattedListingId],
      //   // value: valueInWei, // The ETH amount to be sent with the transaction
      // });
      // Create a new instance of the ethers.js Contract object
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceAbi, await signer);

      // Call the buyNFT function on the contract
      const result = await contract.buyNFT(formattedListingId, { value: valueInWei });

      console.log("result", result);
      return result;
    } catch (error) {
      console.error("Error when calling buyNFT:", error);
      throw error; // Or handle the error as needed
    }
  };

  useEffect(() => {
    console.log("listingId", listingId);
    if (listingId) {
      fetch(`/api/v1/listings/${listingId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          return setDetails(data);
        })
        .catch((error) => console.error("Error fetching NFT details:", error));
    }
  }, [listingId]);

  if (!details.listing || !details.nft) {
    return <div>Loading </div>;
  }
  const { listing, nft } = details as { listing: any; nft: any };

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl">{nft.name}</h1>
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">Created by: {shrinkWalletAddress(listing.sellerAddress)}</h2>
            <div className="text-4xl font-bold ml-auto">{listing.price} wei</div>
          </div>
          <div className="grid gap-2">
            <Button size="lg" onClick={handleBuyNFT}>
              Buy Now
            </Button>
          </div>
          <Separator />
          <div className="grid gap-4 text-sm leading-loose text-left">
            <h2 className="font-bold text-xl">Description:</h2>
            <p>{nft.description}</p>
          </div>
          <Separator />
          <div className="grid gap-4 text-sm leading-loose">
            <p>
              Please note that purchasing this NFT is subject to certain restrictions. Buyers must be members of our platform and should reside in countries where NFT transactions are legally
              permitted.
            </p>
            <p>Membership Tiers:</p>
            <ul className="list-disc list-inside">
              {nft.tiers.map(
                (
                  tier: {
                    name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
                    price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
                    duration: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined;
                  },
                  index: Key | null | undefined
                ) => (
                  <li key={index}>
                    <strong>{tier.name}</strong>: {tier.price} ETH, Duration: {tier.duration} days
                  </li>
                )
              )}
            </ul>
            <p>
              This is a <strong>Premium</strong> NFT. {"\n                      "}
            </p>
          </div>
        </div>
        <div className="grid gap-3 items-start">
          <div className="grid gap-4">
            <img
              alt="NFT Artwork"
              className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
              height={600}
              src={nft.image ?? "/placeholder.svg"}
              width={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
