import { ChatUserstate } from "tmi.js-reply-fork";
import { ClientCommandsController } from "./client.commands.controller";
import { ClientIqController } from "./client.iq.controller";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientOnChatController {
    static async handle(user: ChatUserstate, message: string, adapters: any): Promise<ClientResponseEntity> {
        const simplifiedMessage = message.toLowerCase();
        
        if(simplifiedMessage.startsWith("!iq")) {
            return await ClientIqController.handle(user, message, adapters.messageGeneratorAdapter, adapters.iqAdapter);
        }

        const commandsHandle: ClientResponseEntity = await ClientCommandsController.handle(user, message);
        if (commandsHandle.type !== ClientResponseType.none) {
            return commandsHandle;
        }

        return new ClientResponseEntity(ClientResponseType.none)
        
    }
}