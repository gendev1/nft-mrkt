"use client";

import NFTCard from "@/components/nftCard";
import { useEffect, useState } from "react";

interface Listing {
  nftName: string;
  sellerAddress: string;
  price: number;
  nftImageUrl: string;
  listingId: string;
}

function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const shrinkWalletAddress = (walletAddress: string) => {
    return walletAddress.slice(0, 2) + "..." + walletAddress.slice(-4);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/v1/listings");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log(data);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6  bg-gray-100 dark:bg-gray-900">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <NFTCard
              key={listing.listingId}
              name={listing.nftName}
              seller={shrinkWalletAddress(listing.sellerAddress)}
              price={listing.price}
              imageUrl={listing.nftImageUrl}
              listingId={listing.listingId} // Assuming imageUrl is part of your listing data
            />
          ))}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
