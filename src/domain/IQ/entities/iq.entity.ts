
export class IqEntity {
    constructor(private readonly _amount: number) {}

    get amount(): number {
        return this._amount;
    }

    static of(value: number): IqEntity {
        return new IqEntity(value);
    }


}