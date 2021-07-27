import { CommandsGetCommandResponseEntity } from "../entities/commands.get-command.response-entity";
import { CommandsGetCommandUseCase } from "../ports/in/command.get-command.use-case";
import { CommandsGetCommandCommand } from "../ports/in/commands.get-command.command";
import { CommandsLoadCommandPort } from "../ports/out/commands.load-command.port";

export class CommandsGetCommandService implements CommandsGetCommandUseCase{
    constructor(
        private readonly _commandsLoadCommandPort: CommandsLoadCommandPort
    ) {}

    async getCommand(command: CommandsGetCommandCommand): Promise<CommandsGetCommandResponseEntity> {
        const getCommandMessage: string | null = await this._commandsLoadCommandPort.loadCommand(command.commandName);
        if (getCommandMessage === null) return new CommandsGetCommandResponseEntity(false, command.commandName);
        return new CommandsGetCommandResponseEntity(true, command.commandName, getCommandMessage);
    }
}