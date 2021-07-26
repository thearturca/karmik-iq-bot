import { ChatUserstate } from "tmi.js-reply-fork";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientCommandsController {
    constructor () {}

    public static async handle(user: ChatUserstate, message: string): Promise<ClientResponseEntity> {

        
        return new ClientResponseEntity(ClientResponseType.none);
    }
}