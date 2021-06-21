import { ClientIqController } from "./client.iq.controller";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientOnChatController {
    static async handle(user: any, message: string): Promise<ClientResponseEntity> {
        const simplifiedMessage = message.toLocaleLowerCase();
        
        if(simplifiedMessage.startsWith("!iq")) {
            return await ClientIqController.handle(user, message);
        }

        return new ClientResponseEntity("none")
        
    }
}