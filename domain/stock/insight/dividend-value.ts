import { Stock } from "../stock";
import { Insight } from "../../insight";

export class DividendValue implements Insight<Stock> {
  public readonly name = "Dividend Value";

  get description(): string {
    return `Dividends over ${this.perc}% by year last ${this.years} years`;
  }

  private perc: number;
  private years: number;

  constructor(perc: number, years: number) {
    this.perc = perc;
    this.years = years;
  }

  async verify(data: Stock): Promise<boolean> {
    const year = new Date().getFullYear();

    const price = data.currentState.price;

    const dividendsPaidLast5Years = data.events
      .filter((event) => new Date(event.date).getFullYear() >= year - (this.years + 1) && new Date(event.date).getFullYear() <= year - 1)
      .filter((event) => event.amount)
      .reduce((acc, event) => acc + event.amount, 0);

    const dividendsYearlyAverage = dividendsPaidLast5Years / this.years;

    return dividendsYearlyAverage / price > this.perc / 100;
  }
}
