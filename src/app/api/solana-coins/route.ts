import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      category: "solana-ecosystem",
      order: "market_cap_desc",
      per_page: "10",
      page: "1",
      sparkline: "false",
    });
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      return NextResponse.json({
        error: "Failed to fetch data",
        status: response.status,
      });
    }
    const data = await response.json();
    const coins = await Promise.all(
      data.map(async (coin: { id: string }) => {
        const coinResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.id}`,
        );
        if (!coinResponse.ok) {
          return { ...coin, contract_address: "N/A" };
        }
        const coinData = await coinResponse.json();
        return {
          ...coin,
          contract_address: coinData.platforms.solana || "N/A",
        };
      }),
    );

    return NextResponse.json({ status: 200, data: coins });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
