    export class CommandsGetCommandCommand {
        constructor(
            private readonly _commandName: string
        ) {}

        get commandName(): string {
            return this._commandName;
        }
    }