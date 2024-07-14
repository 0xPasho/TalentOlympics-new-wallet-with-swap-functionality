import { Metadata } from "next";
import WalletHomeContent from "~/modules/wallet/components/wallet-home-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Solana (SOL) Blockchain Explorer",
  description: "Solana (SOL) Blockchain Explorer",
};

export default function HomePage() {
  return (
    <>
      <div className="container:px-0 px-4">
        <WalletHomeContent />
      </div>
    </>
  );
}
