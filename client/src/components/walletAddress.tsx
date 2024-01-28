import { Button } from "@/components/ui/button";

export default function WalletAddress({ walletAddress }: { walletAddress: string }) {
  const shrinkWalletAddress = (walletAddress: string) => {
    return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
  };
  return (
    <Button className="flex items-center space-x-2 px-4 py-2" variant="outline">
      <img
        alt="Blockie"
        className="w-6 h-6 rounded-full"
        height="24"
        src={`https://www.gravatar.com/avatar/${walletAddress}?s=32&d=identicon&r=PG`}
        style={{
          aspectRatio: "24/24",
          objectFit: "cover",
        }}
        width="24"
      />
      <span className="text-sm">{shrinkWalletAddress(walletAddress)}</span>
    </Button>
  );
}
