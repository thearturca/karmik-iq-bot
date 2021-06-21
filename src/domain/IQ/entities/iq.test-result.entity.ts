import { IqUserEntity } from "./iq.user.entity";


export class IqTestResultEntity {
    constructor(
        private readonly _user: IqUserEntity,
    ) {}

    get user(): IqUserEntity {
        return this._user
    }
}