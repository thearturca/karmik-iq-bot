import { ChatUserstate } from "tmi.js-reply-fork";
import { MemesPersistenceAdapter } from "../memes.persistence/memes.persistence.adapter";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientMemesController {

    private static _commandsGetCommandPort: CommandsGetCommandPort;
    constructor () {}

    public static async handle(user: ChatUserstate, message: string, memesAdapter: MemesPersistenceAdapter): Promise<ClientResponseEntity> {
        this._commandsGetCommandPort = new CommandsGetCommandPort(memesAdapter);
        const simplifiedMessage: string = message.toLowerCase();
        const commandArgs :string[] = simplifiedMessage.split(' ');
        const commandName = commandArgs[0];

        const getCommandCommand: CommandsGetCommandCommand = new CommandsGetCommandCommand(commandName)
        const getCommandResponse: CommandsGetCommandResponseEntity = await this._commandsGetCommandPort.getCommand(getCommandCommand);
        if (!getCommandResponse.status) return new ClientResponseEntity(ClientResponseType.none);
        return new ClientResponseEntity(ClientResponseType.reply, user, getCommandResponse.commandMessage);
    }
}