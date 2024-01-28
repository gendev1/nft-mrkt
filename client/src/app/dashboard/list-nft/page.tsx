"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import marketplaceAbi from "@/contracts/NFTMarketplace.json";
import nftAbi from "@/contracts/MembershipNFT.json";
import { marketplaceAddress, membershipNFTAddress } from "@/contracts/deployedAddress";

export default function Component() {
  const { writeContract, isError, isSuccess } = useWriteContract();
  const [nftAddress, setNFTAddress] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [price, setPrice] = useState("");

  const handleNFTAddressChange = (e: { target: { value: string } }) => {
    setNFTAddress(e.target.value);
  };

  const handleTokenNumberChange = (e: { target: { value: string } }) => {
    setTokenNumber(e.target.value);
  };

  const handlePriceChange = (e: { target: { value: string } }) => {
    setPrice(e.target.value);
  };

  const handleListing = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await writeContract({
      abi: marketplaceAbi,
      address: marketplaceAddress,
      functionName: "listNFT",
      args: [nftAddress, tokenNumber, price],
    });
  };

  const handleApproval = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await writeContract({
      abi: nftAbi,
      address: membershipNFTAddress,
      functionName: "setApprovalForAll",
      args: [marketplaceAddress, true],
    });
  };

  return (
    <main className="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
      <div className="w-full max-w-2xl px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">List Your NFT</h1>
        <p className="mt-4 text-center text-gray-500 md:text-xl dark:text-gray-400">Fill in the details about your NFT and submit for approval.</p>
        <form className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nft-address">NFT Address</Label>
            <Input id="nft-address" placeholder="Enter the address of your NFT" required onChange={handleNFTAddressChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token-number">Token Number</Label>
            <Input id="token-number" placeholder="Enter the token number of your NFT" required onChange={handleTokenNumberChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="Enter the price for your NFT" required onChange={handlePriceChange} />
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="flex-1" type="submit" onClick={handleApproval}>
              Request Approval
            </Button>
            <Button className="flex-1" type="submit" onClick={handleListing}>
              List NFT
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
