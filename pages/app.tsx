import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Insights } from "../components/insights";
import Table from "../components/table";
import { Insight } from "../domain/insight";
import {
  DividendConstancy,
  PriceToEarnings,
  DividendValue,
  NetMargin,
  RiskyDebt,
  ProfitConstancyLastYears,
} from "../domain/stock/insight";
import { Stock } from "../domain/stock/stock";
import styles from "../styles/App.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

// TODO: improve this code to follow a better pattern
export async function getStaticProps() {
  const symbols = await fetch("https://raw.githubusercontent.com/jonas-duarte/bovespa-insights-scrapper/main/src/symbols.json").then((res) => res.json());

  const stocks = await Promise.all(
    symbols.map(async (symbol: string) => {
      try {
        const stock = await fetch(`https://raw.githubusercontent.com/jonas-duarte/bovespa-insights-scrapper/main/data/${symbol}.json`).then((res) => res.json());
        return stock;
      } catch (e) {
        console.log(`Error fetching stock ${symbol}`, e);
        return null;
      }
    })
  );

  return {
    props: {
      // remove special characters
      data: JSON.parse(JSON.stringify(stocks.filter((s) => s))),
    },
    // once every 24 hours
    revalidate: 60 * 60 * 24,
  };
}

interface MappedStock {
  name: string;
  business: string;
  price: number;
  mainHolder: string;
  totalDividendsLast5Years: string;
  insightsScore: string;
  positiveInsights: number;
}

class StockTable extends Table<MappedStock> { }
class StockInsights extends Insights<Stock> { }

const insights: Insight<Stock>[] = [
  new DividendConstancy(),
  new PriceToEarnings(),
  new ProfitConstancyLastYears(4),
  new DividendValue(5, 5),
  new DividendValue(10, 5),
  new DividendValue(5, 10),
  new NetMargin(),
  new RiskyDebt(),
];

const App: NextPage<{ data: Stock[] }> = ({ data }) => {
  const router = useRouter();
  const { symbol } = router.query;

  const [stock, setStock] = React.useState<Stock | null>(null);

  const [mappedData, setMappedData] = React.useState<MappedStock[]>([]);

  React.useEffect(() => {
    if (data) {
      (async () => {
        const mappedData: MappedStock[] = await Promise.all(
          data.map(async (stock) => {
            const mainHolder = stock.currentState.holders.reduce(
              (acc, holder) => {
                if (acc.totalShares < holder.totalShares) {
                  return holder;
                }
                return acc;
              },
              { name: "", totalShares: 0 }
            );

            const currentYear = new Date().getFullYear();
            const totalDividendsLast5Years = stock.events
              .filter((event) => new Date(event.date).getFullYear() >= currentYear - 6 && new Date(event.date).getFullYear() <= currentYear - 1)
              .reduce((acc, event) => {
                return acc + event.amount;
              }, 0);

            const positiveInsights = (await Promise.all(insights.map((i) => i.verify(stock)))).filter((res) => res).length;

            const insightsScore = `${positiveInsights}/${insights.length}`;

            const mappedStock: MappedStock = {
              // remove special characters
              name: stock.name.replace(/[^\w\s]/gi, ""),
              business: stock.business,
              price: stock.currentState.price,
              mainHolder: `${mainHolder.name} (${mainHolder.totalShares}%)`,
              totalDividendsLast5Years: totalDividendsLast5Years.toFixed(4),
              insightsScore,
              positiveInsights,
            };

            return mappedStock;
          })
        );

        setMappedData(mappedData.sort((a, b) => b.positiveInsights - a.positiveInsights));
      })();
    }
  }, [data]);

  const setStockBySymbol = (symbol: string | null) => {
    if (symbol) {
      router.push(`/app?symbol=${symbol}`, undefined, { shallow: true });
    } else {
      router.push("/app", undefined, { shallow: true });
    }
  };

  React.useEffect(() => {
    if (symbol) {
      const _stock = data.find((s) => s.name === symbol);
      if (_stock) setStock(_stock);
    } else setStock(null);
  }, [symbol]);

  const escFunction = React.useCallback((event) => {
    if (event.keyCode === 27) {
      setStockBySymbol(null);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Bovespa insights</title>
        <meta name="description" content="Bovespa insights" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Play&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.container}>
        <div className={styles.table}>
          <div className={styles.header}>
            <Link passHref href="/">
              <div className={styles.logo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/logo-opaque.svg" alt="Logo" />
                Bovespa insights
              </div>
            </Link>
          </div>
          <StockTable
            columns={[
              {
                title: "Score",
                dataIndex: "insightsScore",
              },
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Price",
                dataIndex: "price",
              },
              {
                title: "Div/5yr",
                dataIndex: "totalDividendsLast5Years",
              },
              {
                title: "Main Holder",
                dataIndex: "mainHolder",
              },
            ]}
            dataKey="name"
            data={mappedData}
            onRowClick={(stock) => setStockBySymbol(stock.name)}
          />
        </div>
        <div className={styles.insights} data-closed={!stock}>
          <div className={styles.insightsPanel}>
            <div className={styles.insightsHeader}>
              <div
                className={styles.closeInsights}
                onClick={() => {
                  setStockBySymbol(null);
                }}
              >
                X
              </div>
              <div className={styles.insightsTitle}>{stock?.name ?? ""}</div>
            </div>
            {stock && <StockInsights data={stock} insights={insights} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
