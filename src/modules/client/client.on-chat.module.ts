import { ClientOnChatController } from "./client.on-chat.controller";
import { ClientResponseEntity } from "./client.response.entity";

export class ClientOnChatModule {
    constructor () {
    }

    static handle(user: any, message: String):ClientResponseEntity {
        return ClientOnChatController.handle(user, message);
    }
}