import { ChatUserstate } from "tmi.js-reply-fork";
import { CommandsGetCommandResponseEntity } from "../../domain/commands/entities/commands.get-command.response-entity";
import { CommandsGetCommandPort } from "../../domain/commands/ports/in/command.get-command.port";
import { CommandsGetCommandCommand } from "../../domain/commands/ports/in/commands.get-command.command";
import { CommandsPersistenceAdapter } from "../commands.persistence/commands.persistence.adapter";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientCommandsController {

    private static _commandsGetCommandPort: CommandsGetCommandPort;
    constructor () {}

    public static async handle(user: ChatUserstate, message: string, commandsAdapter: CommandsPersistenceAdapter): Promise<ClientResponseEntity> {
        this._commandsGetCommandPort = new CommandsGetCommandPort(commandsAdapter);
        const simplifiedMessage: string = message.toLowerCase();
        const commandArgs :string[] = simplifiedMessage.split(' ');
        const commandName = commandArgs[0]
        const getCommandCommand: CommandsGetCommandCommand = new CommandsGetCommandCommand(commandName)
        const getCommandResponse: CommandsGetCommandResponseEntity = await this._commandsGetCommandPort.getCommand(getCommandCommand);
        if (!getCommandResponse.status) return new ClientResponseEntity(ClientResponseType.none);
        return new ClientResponseEntity(ClientResponseType.reply, user, getCommandResponse.commandMessage);
    }
}