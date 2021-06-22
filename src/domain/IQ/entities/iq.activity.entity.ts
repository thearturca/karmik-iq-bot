import { IqEntity } from "./iq.entity";

export type ActivityId = number | null;

export class IqActivityEntity {
    constructor(
        private readonly _username: string,
        private readonly _timestamp: Date,
        private readonly _iq: IqEntity,
        private readonly _id?: ActivityId
    ) {}

    get username(): string {
        return this._username;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get iq(): number {
        return this._iq.amount;
    }

    get id(): ActivityId {
        return this._id === undefined ? null : this._id;
    }
}