import { Stock } from '../stock';
import { Insight } from '../../insight';


export class PriceToEarnings implements Insight<Stock> {
    public readonly name = "Price To Earnings"
    public readonly description= "Price to earnings between 1 and 20"
    async verify(data: Stock): Promise<boolean> {
        return data.currentState.priceToEarnings > 1 && data.currentState.priceToEarnings < 20;
    }
}