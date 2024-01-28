import { CardContent, Card, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function NFTCard({ name, seller, price, imageUrl, listingId }: { name: string; seller: string; price: number; imageUrl: string; listingId: string }) {
  return (
    <Link href={`/dashboard/nft-details/${listingId}`} passHref>
      <div className="block">
        <Card className="w-full max-w-sm p-4 rounded-lg overflow-hidden">
          <img alt="NFT Image" className="object-cover w-full aspect-square" height="300" src={imageUrl || "/placeholder.svg"} width="300" />
          <CardContent className="flex flex-col items-start space-y-2">
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <div className="flex justify-between w-full">
              <CardDescription className="text-sm bg-green-200 text-green-700 px-2 py-1 rounded-md">Seller: {seller}</CardDescription>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{price} ETH</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
