import { Stock } from "../stock";
import { Insight } from "../../insight";

export class DividendValue implements Insight<Stock> {
  public readonly name = "Dividend Value";
  public readonly description = "Dividends over 5% by year last 5 years";
  async verify(data: Stock): Promise<boolean> {
    const year = new Date().getFullYear();

    const price = data.currentState.price;

    const dividendsPaidLast5Years = data.events
      .filter((event) => new Date(event.date).getFullYear() >= year - 6 && new Date(event.date).getFullYear() <= year - 1)
      .filter((event) => event.amount)
      .reduce((acc, event) => acc + event.amount, 0);

    const dividendsYearlyAverage = dividendsPaidLast5Years / 5;

    return dividendsYearlyAverage / price > 0.05;
  }
}
