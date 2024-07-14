"use client";

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { Coin } from "~/modules/solana/type";
import { useWallet } from "@solana/wallet-adapter-react";
import { CoinDisplayView } from "../types";
import CoinDisplayItem from "./coin-display-item";
import { Skeleton } from "~/components/ui/skeleton";

const CoinsDisplay = ({
  view,
  selected,
  onClick,
}: {
  view: CoinDisplayView;
  selected?: string | null;
  onClick?: (coin: Coin) => void;
}) => {
  const { publicKey, sendTransaction } = useWallet();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await fetch("/api/solana-coins");
      const result = await response.json();
      if (result.status === 200) {
        setCoins(result.data);
      } else {
        console.error("Failed to fetch coins:", result.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendToken = async (contractAddress: string) => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const recipient = new PublicKey(contractAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: 1000000, // Sending 1 SOL (adjust as needed)
      }),
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction successful:", signature);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    const emptyElements = new Array(5).fill(0);
    if (view === "list") {
      return (
        <div className="flex flex-col gap-4">
          {emptyElements.map(() => (
            <div className="w-full">
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {emptyElements.map(() => (
          <div className="aspect-square w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }
  function getRandomNumber() {
    return (Math.random() * 199).toFixed(2);
  }

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {coins.map((coin) => (
          <CoinDisplayItem
            selected={selected === coin.id}
            view={view}
            coin={coin}
            key={`coin-list-item-${coin.id}`}
            onClick={() => {
              if (onClick) {
                onClick(coin);
              }
              sendToken(coin.contract_address);
            }}
          >
            ${getRandomNumber()}
          </CoinDisplayItem>
        ))}
      </div>
    );
  }

  if (view === "picker") {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map((coin) => (
        <CoinDisplayItem
          selected={selected === coin.id}
          view={view}
          coin={coin}
          key={`coin-grid-item-${coin.id}`}
          onClick={() => {
            if (onClick) {
              onClick(coin);
            }
            sendToken(coin.contract_address);
          }}
        />
      ))}
    </div>
  );
};

export default CoinsDisplay;
