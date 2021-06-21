import { ClientOnChatController } from "./client.on-chat.controller";
import { ClientResponseEntity } from "./client.response.entity";

export class ClientOnChatModule {
    constructor () {}

    static async handle(user: any, message: string): Promise<ClientResponseEntity> {
        return await ClientOnChatController.handle(user, message);
    }
}