
type responseMessage = string | undefined;

export class ClientResponseEntity {
    constructor(
        private readonly _responseType: null | string,
        private readonly _user?: any,
        private readonly _responseMessage?: responseMessage,

    ) {}

    get type(): null | string {
        return this._responseType
    }

    get user(): any {
        return this._user
    }

    get message(): string {
        if(this._responseMessage === undefined) return "No response"
        return this._responseMessage;
    }
}