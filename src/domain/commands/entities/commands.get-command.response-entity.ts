

export class CommandsGetCommandResponseEntity {
    constructor(
        private readonly _status: boolean,
        private readonly _command?: string,
        private readonly _commandMessage?: string
    ) {}

    get status(): boolean {
        return this._status;
    }

    get command(): string {
        if (this._command === undefined) return "No such command"
        return this._command;
    }

    get commandMessage(): string {
        if (this._commandMessage === undefined) return "No such command"
        return this._commandMessage;
    }
}