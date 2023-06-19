import { Stock } from '../stock';
import { Insight } from '../../insight';

export class ProfitConstancyLastYears implements Insight<Stock> {
    public readonly name = "Profit Constancy"

    private years: number;

    get description(): string {
        return `Consistent profits last ${this.years} years`;
    }

    constructor(years: number) {
        this.years = years;
    }

    async verify(data: Stock): Promise<boolean> {
        let maxYear = 5;
        for (let i = 1; i < maxYear; i++) {
            const year = new Date().getFullYear() - i

            const item = data.history?.earningsPerShare?.find(item => new Date(item.period).getFullYear() === year)

            if (item && item.value < 0) {
                if (!item && i === 1) {
                    maxYear++
                    continue
                }
                return false
            }
        }

        return true;
    }
}