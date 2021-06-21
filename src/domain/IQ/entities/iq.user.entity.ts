import { IqEntity } from "./iq.entity";
import { getBaseLog, randomG } from "./iq.utility";


export class IqUserEntity {
    constructor(
        public username: string,
        private _iq: IqEntity,
        private _numberOfTries: number,
        private readonly _isVip: boolean,
        private readonly _isSub: boolean,
        public readonly subMonth: number
         ) {}

    get isVip(): boolean {
        return this._isVip;
    }

    get isSUb(): boolean {
        return this._isSub;
    }

    get numberOfTries(): number {
        return this._numberOfTries
    }
    get iq(): number{
        return this._iq.amount;
    }


    set setIq(value: IqEntity) {
        this._iq = value;
    }
    public rollIq() {
        const monthsSubbed: number = Math.abs((2 + Math.floor(randomG() * (24+this.subMonth))));
        const VIPCoeff: number = this.isVip ? Math.floor(randomG() * 20) : 0;
        const monthsCoeff: number = getBaseLog(monthsSubbed, 12);

        const iq_min: number = Math.floor(30 * monthsCoeff + VIPCoeff);
        const iq_max: number = Math.floor(160 * monthsCoeff + VIPCoeff) - iq_min;

        const iq: number = iq_min + Math.floor(randomG() * iq_max);
        this.setIq = IqEntity.of(iq);
        return this.iq;
    }

   
}