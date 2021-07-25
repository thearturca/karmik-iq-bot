import { ChatUserstate } from "tmi.js-reply-fork";

type responseMessage = string | undefined;
export enum ClientResponseType{
    none = "none",
    say = "say",
    reply = "reply"
}

export class ClientResponseEntity {
    constructor(
        private readonly _responseType: ClientResponseType,
        private readonly _user?: ChatUserstate,
        private readonly _responseMessage?: responseMessage,

    ) {}

    get type(): ClientResponseType {
        return this._responseType
    }

    get user(): ChatUserstate | null {
        if (this._user === undefined) return null;
        return this._user
    }

    get message(): string {
        if(this._responseMessage === undefined) return "No response"
        return this._responseMessage;
    }
}