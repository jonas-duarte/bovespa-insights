import { Stock } from "../stock";
import { Insight } from "../../insight";

export class RiskyDebt implements Insight<Stock> {
  public readonly name = "Risky Debt";
  public readonly description = "Annual equity greater than debts";
  async verify(data: Stock): Promise<boolean> {

    return data.currentState.debtByAnnualEquity < 100
  }
}
