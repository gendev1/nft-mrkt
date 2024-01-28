"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import pinata from "@/lib/pinata";
import axios from "axios";

import { useState, useEffect, SetStateAction } from "react";
import { Separator } from "@radix-ui/react-separator";
export default function CreateNFT() {
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [nftImage, setNFTImage] = useState(null);
  const [nftName, setNFTName] = useState("");
  const [nftSymbol, setNFTSymbol] = useState("");
  const [nftDescription, setNFTDescription] = useState("");
  const [nftLink, setNFTLink] = useState("");
  // State for managing tiers
  const [tiers, setTiers] = useState([{ name: "", price: "", duration: "" }]);

  const handleNFTImageChange = (e: any) => {
    const i = e.target.files[0];
    setNFTImage(i);
    setCreateObjectURL(URL.createObjectURL(i));
  };

  const handleNFTNameChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNFTName(e.target.value);
  };

  const handleNFTSymbolChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNFTSymbol(e.target.value);
  };

  const handleNFTDescriptionChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNFTDescription(e.target.value);
  };

  const handleNFTLinkChange = (e: { target: { value: SetStateAction<string> } }) => {
    setNFTLink(e.target.value);
  };

  // Handle change in tier fields
  const handleTierChange = (index: number, field: string, value: string) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  // Add new tier
  const addTier = () => {
    setTiers([...tiers, { name: "", price: "", duration: "" }]);
  };

  const onSubmit = async () => {
    try {
      // Upload image to IPFS

      let imageIpfsHash = "";
      const body = new FormData();

      // // Upload metadata to IPFS

      if (nftImage) {
        body.append("file", nftImage);
      }

      let res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS ", body, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyM2M4YzkxZC1iNTI2LTQxYTItOTUwNi0zN2VmYzhlMTk1OTkiLCJlbWFpbCI6ImhlbGxvQGdlbmVyYWxpc3QuZGV2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI5M2MzYzliMzM0ZTVmODhlYWJkIiwic2NvcGVkS2V5U2VjcmV0IjoiZmIwMTFkNDBiMGE4NjM3NTliMzMyNjk2ZTAwN2MzOWI1MTIzMTRiOTNlMTNlNjEwNGE5YzgxNGI1MDQ0ZTkzZSIsImlhdCI6MTcwNjM3MjQwMX0.T9BY3TweyNy8gRiGert8Vv-_9q0N7sbuIu1B-cNTKj8`,
        },
      });
      console.log(res.data);
      imageIpfsHash = res.data.IpfsHash;

      const metadata = {
        name: nftName,
        Symbol: nftSymbol,
        description: nftDescription,
        external_link: nftLink,
        tiers: tiers,
        image: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
      };
      res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS ", metadata, {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyM2M4YzkxZC1iNTI2LTQxYTItOTUwNi0zN2VmYzhlMTk1OTkiLCJlbWFpbCI6ImhlbGxvQGdlbmVyYWxpc3QuZGV2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI5M2MzYzliMzM0ZTVmODhlYWJkIiwic2NvcGVkS2V5U2VjcmV0IjoiZmIwMTFkNDBiMGE4NjM3NTliMzMyNjk2ZTAwN2MzOWI1MTIzMTRiOTNlMTNlNjEwNGE5YzgxNGI1MDQ0ZTkzZSIsImlhdCI6MTcwNjM3MjQwMX0.T9BY3TweyNy8gRiGert8Vv-_9q0N7sbuIu1B-cNTKj8`,
        },
      });

      // await createNFT(metadata);
      console.log(res.data);
      // clear form
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setNFTImage(null);
    setNFTName("");
    setNFTSymbol("");
    setNFTDescription("");
    setNFTLink("");
    setTiers([{ name: "", price: "", duration: "" }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-grow p-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload NFT Image</CardTitle>
            <CardDescription>Upload the image you want to mint as an NFT.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <img src={createObjectURL} />
              <Label htmlFor="nft-image">NFT Image</Label>
              <Input id="nft-image" type="file" onChange={handleNFTImageChange} />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>NFT Details</CardTitle>
            <CardDescription>Provide name and description for your NFT.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="nft-description">Name</Label>
              <Input id="nft-description" placeholder="Enter NFT name" onChange={handleNFTNameChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="nft-description">Symbol</Label>
              <Input id="nft-description" placeholder="Enter NFT symbol" onChange={handleNFTDescriptionChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="nft-description">Description</Label>
              <Input id="nft-description" placeholder="Enter NFT description" onChange={handleNFTDescriptionChange} />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Links</CardTitle>
            <CardDescription>Add any additional links related to your NFT.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="nft-link">Link</Label>
              <Input id="nft-link" placeholder="Enter link URL" onChange={handleNFTLinkChange} />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Set Membership Tiers</CardTitle>
            <CardDescription>Set up different tiers of membership with details like duration.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tiers.map((tier, i) => (
                <div key={i}>
                  <p className="pb-2">Tier {i + 1}</p>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`tier-name-${i}`}>Tier Name</Label>
                    <Input id={`tier-name-${i}`} placeholder="Enter tier name" value={tier.name} onChange={(e) => handleTierChange(i, "name", e.target.value)} />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`tier-price-${i}`}>Tier Price</Label>
                    <Input id={`tier-price-${i}`} placeholder="Enter tier price in Matic" value={tier.price} onChange={(e) => handleTierChange(i, "price", e.target.value)} />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`tier-duration-${i}`}>Tier Duration</Label>
                    <Input id={`tier-duration-${i}`} placeholder="Enter duration in days" value={tier.duration} onChange={(e) => handleTierChange(i, "duration", e.target.value)} />
                  </div>
                  {i !== 0 ? <Separator /> : null}
                </div>
              ))}
              <Button onClick={addTier}>Add Tier</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onSubmit()}>Add NFT Metadata to IPFS</Button>
        </div>
      </main>
    </div>
  );
}
