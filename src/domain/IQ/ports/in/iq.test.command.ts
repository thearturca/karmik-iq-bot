import { IqUserEntity, isSub, isVip } from "../../entities/iq.user.entity";


export class IqTestCommand {
    constructor(
        private readonly _username: string,
        private readonly _isVip: isVip,
        private readonly _isSub: isSub,
        private readonly _subMonths: number,
        private readonly _message: string
    ) {}

    get username() {
        return this._username;
    }

    get isVip() {
        return this._isVip;
    }

    get isSub() {
        return this._isSub;
    }

    get subMonths() {
        return this._subMonths
    }

    get message() {
        return this._message
    }
}