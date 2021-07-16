export class IqTestResultEntity {
    constructor(
        private readonly _status: boolean,
        private readonly _iq: number,
        private readonly _lastTryTimestamp: number,
        private readonly _maxTryNumber: number,
        private readonly _tryNumber: number
    ) {}

    get status(): boolean {
        return this._status;
    }

    get iq(): number {
        return this._iq;
    }

    get lastTryTimestamp(): number {
        return this._lastTryTimestamp;
    }

    get maxTryNumber(): number {
        return this._maxTryNumber;
    }

    get tryNumber(): number {
        return this._tryNumber;
    }
}