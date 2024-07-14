import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import CoinsDisplay from "./coins-display";
import { Input } from "~/components/ui/input";
import { Coin } from "~/modules/solana/type";
import { ArrowLeft } from "lucide-react";
import * as web3 from "@solana/web3.js";
import { getProvider } from "~/modules/solana/utils/program";
import { useWallet } from "@solana/wallet-adapter-react";

const SendStepper = ({ defaultCoin }: { defaultCoin?: Coin }) => {
  const [coinSelected, setCoinSelected] = React.useState<Coin | null>(
    defaultCoin || null,
  );
  const [address, setAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const provider = useWallet();
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const transferSol = async () => {
    try {
      setLoading(true);
      // var provider: any = await getProvider();
      await provider.connect();
      console.log("Public key of the emitter: ", provider.publicKey.toString());

      var connection = new web3.Connection(web3.clusterApiUrl("devnet")); //env.NEXT_PUBLIC_ALCHEMY_RPC_URL);

      var recieverWallet = new web3.PublicKey(address);

      var transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: recieverWallet,
          lamports: parseInt(`${amount}000000000`), //Investing 1 SOL. 1 Lamport = 10^-9 SOL.
        }),
      );
      transaction.feePayer = await provider.publicKey;
      let blockhashObj = await connection.getRecentBlockhash();
      transaction.recentBlockhash = await blockhashObj.blockhash;

      // Transaction constructor initialized successfully
      if (transaction) {
        console.log("Txn created successfully");
      }

      // Request creator to sign the transaction (allow the transaction)
      let signed = await provider.signTransaction(transaction);
      // The signature is generated
      let signature = await connection.sendRawTransaction(signed.serialize());
      // Confirm whether the transaction went through or not
      await connection.confirmTransaction(signature);

      //Print the signature here
      console.log("Signature: ", signature);
    } catch (error) {
      console.error("Error transferring SOL:", error);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  if (!coinSelected) {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>Send Tokens</DrawerTitle>
          <DrawerDescription>
            Select token and insert the amount!
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <CoinsDisplay
            selected={coinSelected?.id}
            onClick={(coin) => setCoinSelected(coin)}
            view="grid"
          />
        </div>
      </>
    );
  }
  return (
    <>
      <DrawerHeader className="flex flex-row gap-2">
        <ArrowLeft
          onClick={() => {
            setCoinSelected(null);
          }}
        />
        <div>
          <DrawerTitle>Send {coinSelected.symbol}</DrawerTitle>
          <DrawerDescription>
            Fill the address and the amount to continue :)
          </DrawerDescription>
        </div>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <Input
          className="h-14 w-full text-xl"
          placeholder="Destination"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <Input
          className="mt-4 h-14 w-full text-xl"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>
      <DrawerFooter
        onClick={() => {
          transferSol();
        }}
      >
        <Button
          className="text-white"
          disabled={(!amount && !address) || loading}
          loading={loading}
        >
          Send
        </Button>
      </DrawerFooter>
      {sent && (
        <div className="w-full text-center">
          <span className="text-center text-lg text-green-500">
            Transaction was sent correctly
          </span>
        </div>
      )}
    </>
  );
};
export function SendDrawer({
  children,
  defaultCoin,
}: {
  defaultCoin?: Coin;
  children: React.ReactNode;
}) {
  const [coinSelected, setCoinSelected] = React.useState<string>(null);
  return (
    <Drawer
      onClose={() => {
        setCoinSelected(null);
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto max-h-[70vh] min-h-[50vh] w-full w-full max-w-container overflow-y-auto">
          <SendStepper defaultCoin={defaultCoin} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
