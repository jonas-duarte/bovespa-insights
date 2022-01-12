export interface Insight<D> {
    name: string;
    description: string;
    verify(data: D): Promise<boolean>;
}