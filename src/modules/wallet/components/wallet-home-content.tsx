"use client";

import { Button } from "~/components/ui/button";
import CoinsDisplay from "./coins-display";
import { HandCoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SendDrawer } from "./send-drawer";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletConnectorButtons from "./wallet-connect-buttons";
import { SwapDrawer } from "./swap-drawer";

export default function WalletHomeContent() {
  const router = useRouter();
  const { connected } = useWallet();
  return (
    <div className="container:px-0 mx-auto flex min-h-screen max-w-container flex-col ">
      <div className="max-x-container mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-medium">Total Balance</h2>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">$1,067.32</span>
            <span className="text-sm text-gray-400">≈ 0.08 BTC</span>
          </div>
        </div>
        <div className="mb-8 grid grid-cols-3 gap-4">
          {!connected ? (
            <WalletConnectorButtons onConnect={() => {}} />
          ) : (
            <>
              <SendDrawer>
                <Button className="text-white">
                  <div className="flex flex-row">
                    <div>
                      <SendIcon className="mr-2 h-5 w-5" />
                    </div>
                    <span className="flex flex-1">Send</span>
                  </div>
                </Button>
              </SendDrawer>
              <SwapDrawer>
                <Button className="flex justify-center text-white">
                  <div className="flex flex-row">
                    <div className="flex justify-center">
                      <HandCoinsIcon className="mr-2 h-5 w-5" />
                    </div>
                    <span className="flex flex-1">Swap</span>
                  </div>
                </Button>
              </SwapDrawer>
              <Button
                className="text-white"
                onClick={() => {
                  router.push("https://pancakeswap.finance/");
                }}
              >
                <div className="flex flex-row">
                  <div className="hidden md:flex">
                    <CurrencyIcon className="mr-2 h-5 w-5" />
                  </div>
                  <span className="flex flex-1">Exchange</span>
                </div>
              </Button>
            </>
          )}
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium">Cryptocurrency Holdings</h2>
          <CoinsDisplay view="list" />
        </div>
      </div>
    </div>
  );
}

function CurrencyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
