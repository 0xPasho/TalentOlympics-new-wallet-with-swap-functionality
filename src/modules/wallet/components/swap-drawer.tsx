import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import CoinsDisplay from "./coins-display";
import { Input } from "~/components/ui/input";
import { Coin } from "~/modules/solana/type";
import * as web3 from "@solana/web3.js";
import { SolanaTracker } from "solana-swap";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
const SwapStepper = () => {
  const [fromAmount, setFromAmount] = React.useState("");
  const [fromCoin, setFromCoin] = React.useState<Coin | null>(null);
  const [toCoin, setToCoin] = React.useState<Coin | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [swapped, setSwapped] = React.useState(false);
  const [amountSubmited, setAmountSubmited] = React.useState(false);

  const swapToken = async () => {
    try {
      setLoading(true);
      const keypair = web3.Keypair.fromSecretKey(
        bs58.decode(fromCoin.contract_address),
      );
      const solanaTracker = new SolanaTracker(
        keypair,
        "https://rpc.solanatracker.io/public?advancedTx=true",
      );
      const swapResponse = await solanaTracker.getSwapInstructions(
        fromCoin.contract_address,
        toCoin.contract_address,
        parseFloat(fromAmount), // Amount to swap
        30,
        keypair.publicKey.toBase58(), // Payer public key
        0.0005, // Priority fee (Recommended while network is congested)
      );

      const txid = await solanaTracker.performSwap(swapResponse, {
        sendOptions: { skipPreflight: true },
        confirmationRetries: 30,
        confirmationRetryTimeout: 500,
        lastValidBlockHeightBuffer: 150,
        resendInterval: 1000,
        confirmationCheckInterval: 1000,
        commitment: "processed",
        skipConfirmationCheck: false,
      });
      // Returns txid when the swap is successful or throws an error if the swap fails
      console.log("Transaction ID:", txid);
      console.log("Transaction URL:", `https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error("Error transferring SOL:", error);
    } finally {
      setLoading(false);
      setSwapped(true);
    }
  };

  if (!fromCoin) {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>From Which Token</DrawerTitle>
          <DrawerDescription>Select from token!</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <CoinsDisplay
            selected={fromCoin?.id}
            onClick={(coin) => setFromCoin(coin)}
            view="grid"
          />
        </div>
      </>
    );
  }

  if (!amountSubmited) {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>How many Tokens?</DrawerTitle>
          <DrawerDescription>Write the amount!</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Input
            className="h-14 w-full text-xl"
            placeholder="Amount of tokens"
            onChange={(e) => setFromAmount(e.target.value)}
            value={fromAmount}
          />
          <Button
            className="mt-2 w-full text-white"
            disabled={!fromAmount}
            onClick={() => {
              setAmountSubmited(true);
            }}
          >
            Next
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Select Destination and Submit</DrawerTitle>
        <DrawerDescription>
          Select the token which you want to swap to!
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        {!toCoin && (
          <CoinsDisplay
            selected={toCoin?.id}
            onClick={(coin) => setToCoin(coin)}
            view="grid"
          />
        )}
        {toCoin && (
          <span className="mb-2 text-gray-500">
            You are about to swap {fromAmount} {fromCoin.name}(
            {fromCoin.symbol.toUpperCase()}) to {toCoin.name}(
            {toCoin.symbol.toUpperCase()})
          </span>
        )}
        <Button
          className="w-full text-white"
          disabled={loading || !toCoin}
          loading={loading}
          onClick={() => {
            swapToken();
          }}
        >
          {toCoin ? "Swap!" : "Select and Swap!"}
        </Button>
        {swapped && (
          <div className="w-full text-center">
            <span className="text-center text-lg text-green-500">
              Tokens were successfully swapped
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export function SwapDrawer({ children }: { children?: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto max-h-[70vh] min-h-[50vh] w-full w-full max-w-container overflow-y-auto">
          <SwapStepper />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
