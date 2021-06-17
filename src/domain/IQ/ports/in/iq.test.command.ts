import { IqUserEntity } from "../../entities/iq.user.entity";


export class IqTestCommand {
    constructor(
        private readonly _user: IqUserEntity,
        private readonly _message: string
    ) {}

    get user() {
        return this._user;
    }

    get message() {
        return this._message
    }
}