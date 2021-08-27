import { ChatUserstate } from "tmi.js-reply-fork";
import { MemesTypes } from "../../domain/memes/entities/memes.factory-entity";
import { MemesGetMemeResponseEntity } from "../../domain/memes/entities/memes.get-meme.response-entity";
import { MemesGetMemeCommand } from "../../domain/memes/ports/in/memes.get-meme.command";
import { MemesGetMemePort } from "../../domain/memes/ports/in/memes.get-meme.port";
import { MemesPersistenceAdapter } from "../memes.persistence/memes.persistence.adapter";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientMemesController {

    private static _memesGetMemePort: MemesGetMemePort;
    constructor () {}

    public static async handle(user: ChatUserstate, message: string, memesAdapter: MemesPersistenceAdapter): Promise<ClientResponseEntity> {
        this._memesGetMemePort = new MemesGetMemePort(memesAdapter, memesAdapter);
        const simplifiedMessage: string = message.toLowerCase();
        const username = user["display-name"] || "Anonymous"

        const getMemeCommand: MemesGetMemeCommand = new MemesGetMemeCommand(simplifiedMessage, username)
        const getMemeResponse: MemesGetMemeResponseEntity = await this._memesGetMemePort.getMeme(getMemeCommand);
        if (!getMemeResponse.status) return new ClientResponseEntity(ClientResponseType.none);
        switch(getMemeResponse.meme) {
            case MemesTypes.bigracc:
            case MemesTypes.gachi:
            case MemesTypes.pugpls:
                return new ClientResponseEntity(ClientResponseType.say, user, getMemeResponse.memeMessage);
            case MemesTypes.toilet:
                return new ClientResponseEntity(ClientResponseType.reply, user, getMemeResponse.memeMessage);
            default:
                return new ClientResponseEntity(ClientResponseType.reply, user, getMemeResponse.memeMessage);
        }
    }
}