
type responseMessage = string | undefined;
export enum ClientResponseType{
    none = "none",
    say = "say",
    reply = "reply"
}

export class ClientResponseEntity {
    constructor(
        private readonly _responseType: ClientResponseType,
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