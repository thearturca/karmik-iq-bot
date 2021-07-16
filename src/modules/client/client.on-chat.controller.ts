import { ClientIqController } from "./client.iq.controller";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientOnChatController {
    static async handle(user: any, message: string, adapters: any): Promise<ClientResponseEntity> {
        const simplifiedMessage = message.toLowerCase();
        
        if(simplifiedMessage.startsWith("!iq")) {
            return await ClientIqController.handle(user, message, adapters.messageGeneratorAdapter, adapters.iqAdapter);
        }

        return new ClientResponseEntity("none")
        
    }
}