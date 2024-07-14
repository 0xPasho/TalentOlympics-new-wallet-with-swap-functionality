import { Coin } from "~/modules/solana/type";
import { CoinDisplayView } from "../types";
import { cn, currencyFormatter } from "~/lib/utils";
import { ReactNode } from "react";

const CoinDisplayItem = ({
  coin,
  view,
  onClick,
  children,
  selected,
}: {
  coin: Coin;
  view: CoinDisplayView;
  onClick: (coin: Coin) => void;
  children?: ReactNode;
  selected?: boolean;
}) => {
  if (view === "list") {
    return (
      <div className="flex items-center justify-between rounded-lg p-4 shadow-md hover:cursor-pointer hover:bg-accent">
        <div className="flex items-center gap-4">
          <img src={coin.image} alt={coin.name} className="h-8 w-8 " />
          <div>
            <h3 className="text-lg font-medium">{coin.name}</h3>
            <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{children}</p>
          <p className="text-sm text-gray-400">
            {currencyFormatter.format(coin.current_price)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-1 cursor-pointer rounded border-transparent p-6 shadow-md hover:bg-accent",
        selected ? "border-primary" : "",
      )}
      onClick={() => onClick(coin)}
    >
      <img
        src={coin.image}
        alt={coin.name}
        className="mx-auto mb-4 h-16 w-16"
      />
      <h2 className="text-center text-xl font-semibold">{coin.name}</h2>
      <p className="text-center text-gray-500 dark:text-gray-300">
        {coin.symbol.toUpperCase()} (
        {currencyFormatter.format(coin.current_price)})
      </p>
      <p className="break-all text-center text-gray-700 dark:text-gray-500">
        {coin.contract_address}
      </p>
    </div>
  );
};

export default CoinDisplayItem;
