"use client";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

// import to fix polyfill issue with buffer with webpack
import * as buffer from "buffer";
import { Button, buttonVariants } from "~/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { cn } from "~/lib/utils";
window.Buffer = buffer.Buffer;

// create types
type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

// create a provider interface (hint: think of this as an object) to store the Phantom Provider
interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding,
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

/**
 * @description gets Phantom provider, if it exists
 */
const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function WalletConnectorButtons({
  onConnect,
}: {
  onConnect: () => void;
}) {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined,
  );
  const [receiverPublicKey, setReceiverPublicKey] = useState<
    PublicKey | undefined
  >(undefined);
  const [senderKeypair, setSenderKeypair] = useState<Keypair | undefined>(
    undefined,
  );
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const provider = getProvider();
    if (provider) setProvider(provider);
  }, []);

  const connectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const { publicKey } = await provider.connect();
        console.log(
          "Connected to Phantom Wallet. Public key:",
          publicKey.toBase58(),
        );

        setReceiverPublicKey(publicKey);
        onConnect();
      } catch (err) {
        console.error("Error connecting to Phantom Wallet:", err);
      }
    }
  };

  return (
    <>
      <WalletMultiButtonDynamic
        onClick={() => {
          onConnect();
        }}
        className={cn("text-white", buttonVariants({ variant: "default" }))}
      />
      {!provider && (
        <p>
          No provider found. Install{" "}
          <a href="https://phantom.app/">Phantom Browser extension</a>
        </p>
      )}
    </>
  );
}
