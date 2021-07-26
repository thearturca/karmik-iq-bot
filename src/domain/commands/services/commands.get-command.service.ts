import { CommandsLoadCommandPort } from "../ports/out/commands.load-command.port";

export class CommandsGetCommandService {
    constructor(
        private readonly _commandsLoadCommandPort: CommandsLoadCommandPort
    ) {}
}