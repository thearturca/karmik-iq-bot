import { IqEntity } from "./iq.entity";
import { getBaseLog, randomG } from "./iq.utility";

export type isSub = boolean | undefined;
export type isVip = boolean | undefined;
export type userId = number | null;

export class IqUserEntity {
    constructor(
        public username: string,
        private _iq: IqEntity,
        private readonly _id?: userId,
        private _isVip?: boolean,
        private _isSub?: boolean,
        private _subMonths?: number,
         ) {}

    get isVip(): isVip{
        if(this._isVip === undefined) {
            return false;
        }
        return this._isVip;
    }

    set setIsVip(value: isVip) {
        this._isVip = value;
    }

    get isSub(): isSub{
        if(this._isSub === undefined) {
            return false;
        }
        return this._isSub;
    }

    set setIsSub(value: isSub) {
        this._isSub = value;
    }

    get subMonths(): number {
        return this._subMonths || 0;
    }

    set setSubMonths(value: number) {
        this._subMonths = value;
    }

    get iq(): number{
        return this._iq.amount;
    }


    set setIq(value: IqEntity) {
        this._iq = value;
    }

    get id(): userId {
        return this._id === undefined ? null : this._id;
    }

    public rollIq() {
        const monthsSubbed: number = Math.abs((2 + Math.floor(randomG() * (24+this.subMonths))));
        const VIPCoeff: number = this.isVip ? Math.floor(randomG() * 20) : 0;
        const monthsCoeff: number = getBaseLog(monthsSubbed, 12);

        const iq_min: number = Math.floor(50 * monthsCoeff + VIPCoeff);
        const iq_max: number = Math.floor(160 * monthsCoeff + VIPCoeff) - iq_min;

        const iq: number = iq_min + Math.floor(randomG() * iq_max);
        this.setIq = IqEntity.of(iq);
        return this.iq;
    }

   
}