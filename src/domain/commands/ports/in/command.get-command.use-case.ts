import { CommandsGetCommandResponseEntity } from "../../entities/commands.get-command.response-entity";
import { CommandsGetCommandCommand } from "./commands.get-command.command";


export interface CommandsGetCommandUseCase {
    getCommand(command: CommandsGetCommandCommand): Promise<CommandsGetCommandResponseEntity>
}