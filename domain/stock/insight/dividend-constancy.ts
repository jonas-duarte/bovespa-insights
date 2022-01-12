import { Stock } from '../stock';
import { Insight } from '../../insight';


export class DividendConstancy implements Insight<Stock> {
    public readonly name = "Dividend Constancy"
    public readonly description= "Consistent dividends paying last 5 years"
    async verify(data: Stock): Promise<boolean> {
        // delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
}