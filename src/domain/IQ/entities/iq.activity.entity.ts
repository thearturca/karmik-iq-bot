export type ActivityId = number | null;

export class IqActivityEntity {
    constructor(
        private readonly _username: string,
        private readonly _timestamp: Date,
        private readonly _iq: number,
        private readonly _id?: ActivityId
    ) {}

    get username(): string {
        return this._username;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get iq(): number {
        return this._iq;
    }

    get id(): ActivityId {
        return this._id === undefined ? null : this._id;
    }
}