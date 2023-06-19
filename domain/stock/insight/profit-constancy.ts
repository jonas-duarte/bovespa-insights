import { Stock } from '../stock';
import { Insight } from '../../insight';


export class ProfitConstancy5Years implements Insight<Stock> {
    public readonly name = "Profit Constancy"
    public readonly description= "Consistent profits last 5 years"
    async verify(data: Stock): Promise<boolean> {
        let maxYear = 6;
        for (let i = 1; i < maxYear; i++) {
            const year = new Date().getFullYear() - i

            const item = data.history?.earningsPerShare?.find(item => new Date(item.period).getFullYear() === year)

            if(item && item.value < 0) {
                if(!item && i === 1) {
                    maxYear++
                    continue
                }
                return false
            }
        }

        return true;
    }
}


export class ProfitConstancy10Years implements Insight<Stock> {
    public readonly name = "Profit Constancy"
    public readonly description= "Consistent profits last 10 years"
    async verify(data: Stock): Promise<boolean> {
        let maxYear = 11;
        for (let i = 1; i < maxYear; i++) {
            const year = new Date().getFullYear() - i

            const item = data.history?.earningsPerShare?.find(item => new Date(item.period).getFullYear() === year)

            if(item && item.value < 0) {
                if(!item && i === 1) {
                    maxYear++
                    continue
                }
                return false
            }
        }

        return true;
    }
}