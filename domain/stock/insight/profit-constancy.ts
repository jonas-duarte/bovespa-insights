import { Stock } from '../stock';
import { Insight } from '../../insight';


export class ProfitConstancy implements Insight<Stock> {
    public readonly name = "Profit Constancy"
    public readonly description= "Consistent profits last 5 years"
    async verify(data: Stock): Promise<boolean> {
        return true;
    }
}