import { IqActivityWindowEntity } from "./iq.activity-window.entity";
import { IqActivityEntity } from "./iq.activity.entity";
import { IqEntity } from "./iq.entity";
import { getBaseLog, randomG } from "./iq.utility";

export type isSub = boolean | undefined;
export type isVip = boolean | undefined;
export type userId = number | null;

export class IqUserEntity {
    constructor(
        public username: string,
        private readonly _activityWindow: IqActivityWindowEntity,
        private readonly _id?: userId,
        private _iq?: number,
        private _isVip?: boolean,
        private _isSub?: boolean,
        private _subMonths?: number,
         ) {}

    get activityWindow():IqActivityWindowEntity {
        return this._activityWindow;
    }

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
        if (this._iq === undefined) return this.rollIq();
        return this._iq;
    }


    set setIq(value: number) {
        this._iq = value;
    }

    get id(): userId {
        return this._id === undefined ? null : this._id;
    }

    public rollIq() {
        const monthsSubbed: number = Math.abs((2 + Math.floor(randomG() * (24+this.subMonths))));
        const VIPCoeff: number = this.isVip ? Math.floor(randomG() * 20) : 0;
        const monthsCoeff: number = getBaseLog(monthsSubbed, 12);

        const iq_min: number = Math.floor(30 * monthsCoeff + VIPCoeff);
        const iq_max: number = Math.floor(160 * monthsCoeff + VIPCoeff) - iq_min;

        const iq: number = iq_min + Math.floor(randomG() * iq_max);
        this.setIq = iq;

        console.log(`monthsSubbed = ${monthsSubbed}`);
        console.log(`VIPCoeff = ${VIPCoeff}`);
        console.log(`monthsCoeff = ${monthsCoeff}`);
        console.log(`iq_min = ${iq_min}`);
        console.log(`iq_max = ${iq_max}`);
        console.log(`iq = ${iq}`);

        const activity: IqActivityEntity = new IqActivityEntity(this.username, new Date(), this.iq)
        this._activityWindow.addActivity(activity)
        return this.iq;
    }

   
}