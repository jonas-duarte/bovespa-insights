import { Stock } from '../stock';
import { Insight } from '../../insight';


export class DividendConstancy implements Insight<Stock> {
    public readonly name = "Dividend Constancy"
    public readonly description= "Consistent dividends paying last 5 years"
    async verify(data: Stock): Promise<boolean> {
        for (let i = 1; i < 6; i++) {
            const year = new Date().getFullYear() - i

            const dividend = data.events.find(event => new Date(event.date).getFullYear() === year)

            if(!dividend) {
                return false
            }
        }

        return true;
    }
}