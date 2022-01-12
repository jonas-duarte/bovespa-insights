import { Stock } from "../stock";
import { Insight } from "../../insight";

export class NetMargin implements Insight<Stock> {
  public readonly name = "Net Margin";
  public readonly description = "Net Margin over 8% by year last 5 years";
  async verify(data: Stock): Promise<boolean> {
    const year = new Date().getFullYear();

    const item = data.history?.netMargin?.find((item) => item.value < 0.08 && new Date(item.period).getFullYear() > year - 5);

    if (item) {
      return false;
    }

    return true;
  }
}
