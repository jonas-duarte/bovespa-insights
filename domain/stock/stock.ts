import { PriceToEarnings } from './insight/price-to-earnings';
export interface Holder {
    name: string;
    ordinaryShares: number;
    preferredShares: number;
    totalShares: number;
}

export interface StockState{
    price: number;
    priceToEarnings: number;
    debtByAnnualEquity: number;
    holders: Holder[];
}

export interface StockEvent{
    date: number;
    amount: number;
    type: string;
}

export interface StockHistory{
    period: string;
    value: number;
}    

export interface Stock {
    name: string;
    business: string;
    currentState: StockState;
    events: StockEvent[];
    history: {        
        earningsPerShare: StockHistory[];
        netMargin: StockHistory[];
    }
}