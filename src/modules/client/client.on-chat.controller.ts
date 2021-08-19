import { ChatUserstate } from "tmi.js-reply-fork";
import { ClientCommandsController } from "./client.commands.controller";
import { ClientIqController } from "./client.iq.controller";
import { ClientMemesController } from "./client.memes.controller";
import { ClientPastaController } from "./client.pasta.controller";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientOnChatController {
    static async handle(user: ChatUserstate, message: string, adapters: any): Promise<ClientResponseEntity> {
        const simplifiedMessage = message.toLowerCase();
        
        if(simplifiedMessage.startsWith("!iq")) {
            return await ClientIqController.handle(user, message, adapters.messageGeneratorAdapter, adapters.iqAdapter);
        }

        if(simplifiedMessage.startsWith("!паста")) {
            return await ClientPastaController.handle(user, message, adapters.pastaAdapter);
        }

        if(simplifiedMessage.startsWith("!")) {
            const commandsHandle: ClientResponseEntity = await ClientCommandsController.handle(user, message, adapters.commandsAdapter);
            if (commandsHandle.type !== ClientResponseType.none) {
                return commandsHandle;
            }
        }

        const memesHandle: ClientResponseEntity = await ClientMemesController.handle(user, message, adapters.memesAdapter);
        if (memesHandle.type !== ClientResponseType.none) {
            return memesHandle;
        }

        return new ClientResponseEntity(ClientResponseType.none)
        
    }
}