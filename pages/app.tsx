import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Insights } from "../components/insights";
import Table from "../components/table";
import { Insight } from "../domain/insight";
import { DividendConstancy, PriceToEarnings, ProfitConstancy } from "../domain/stock/insight";
import { Stock } from "../domain/stock/stock";
import styles from "../styles/App.module.css";

interface FinnhubApiStock {
  symbol: string;
  description: string;
}

export async function getStaticProps() {
  const mockData: Stock[] = [
    {
      name: "Apple",
      business: "Technology",
      currentState: {
        price: 100,
        holders: [
          {
            name: "Steve",
            ordinaryShares: 21,
            preferredShares: 0,
            totalShares: 14,
          },
        ],
      },
      events: [
        {
          amount: 100,
          date: new Date("2020-01-01").getTime(),
        },
      ],
      history: [
        { period: "2020-01-01", profit: 100, revenue: 100 },
        { period: "2020-01-01", profit: 100, revenue: 100 },
        { period: "2020-01-01", profit: 100, revenue: 100 },
        { period: "2020-01-01", profit: 100, revenue: 100 },
      ],
    },
    {
      name: "Microsoft",
      business: "Technology",
      currentState: {
        price: 100,
        holders: [
          {
            name: "Bill",
            ordinaryShares: 51,
            preferredShares: 0,
            totalShares: 14,
          },
        ],
      },
      events: [
        {
          amount: 100,
          date: new Date("2020-01-01").getTime(),
        },
      ],
      history: [{ period: "2020-01-01", profit: 100, revenue: 100 }],
    },
  ];

  return {
    props: {
      data: mockData,
      // once every 24 hours
      revalidate: 60 * 60 * 24,
    },
  };
}

interface MappedStock {
  name: string;
  business: string;
  price: number;
  mainHolder: string;
  totalDividendsLast5Years: number;
}

class StockTable extends Table<MappedStock> {}
class StockInsights extends Insights<Stock> {}

const insights: Insight<Stock>[] = [new DividendConstancy(), new PriceToEarnings(), new ProfitConstancy()];

const App: NextPage<{ data: Stock[] }> = ({ data }) => {
  const [stock, setStock] = React.useState<Stock | null>(null);

  const mappedStockData = data.map((stock) => {
    const mainHolder = stock.currentState.holders.reduce(
      (acc, holder) => {
        if (acc.totalShares < holder.totalShares) {
          return holder;
        }
        return acc;
      },
      { name: "", totalShares: 0 }
    );

    const totalDividendsLast5Years = stock.events.reduce((acc, event) => {
      return acc + event.amount;
    }, 0);

    return {
      name: stock.name,
      business: stock.business,
      price: stock.currentState.price,
      mainHolder: `${mainHolder.name} (${mainHolder.totalShares}%)`,
      totalDividendsLast5Years,
    };
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Bovespa insights</title>
        <meta name="description" content="Bovespa insights" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.table}>
          <StockTable
            columns={[
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Business",
                dataIndex: "business",
              },
              {
                title: "Price",
                dataIndex: "price",
              },
              {
                title: "Main Holder",
                dataIndex: "mainHolder",
              },
              {
                title: "Div/5yr",
                dataIndex: "totalDividendsLast5Years",
              },
            ]}
            dataKey="name"
            data={mappedStockData}
            onRowClick={(stock) => {
              const _stock = data.find((s) => s.name === stock.name);
              if (_stock) setStock(_stock);
            }}
          />
        </div>
        <div className={styles.insights} data-closed={!stock}>
          <div className={styles.insightsPanel}>
            <div className={styles.insightsHeader}>
              <div
                className={styles.closeInsights}
                onClick={() => {
                  setStock(null);
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
