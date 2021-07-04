

export class IqLoadUserCommand {
    constructor (
        private readonly _username: string
    ) {}

    get username(): string {
        return this._username;
    }
}