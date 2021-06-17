import { ClientIqController } from "./client.iq.controller";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientOnChatController {
    static handle(user: any, message: string): ClientResponseEntity {
        const simplifiedMessage = message.toLocaleLowerCase();

        if(simplifiedMessage.startsWith("!iq")) {
            return ClientIqController.handle(user, message);
        }

        return new ClientResponseEntity("none")
        
    }
}