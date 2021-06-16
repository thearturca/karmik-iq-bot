import { IqUserEntity } from "../../entities/iq.user.entity";


export class IqTestCommand {
    constructor(
        private readonly _user: IqUserEntity
    ) {}

    get user() {
        return this._user;
    }
}