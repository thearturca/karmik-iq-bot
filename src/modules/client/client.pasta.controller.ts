import { ChatUserstate } from "tmi.js-reply-fork";
import { PastaGetPastaResponseEntity } from "../../domain/pasta/entities/pasta.get-pasta.response-entity";
import { AddPastaCommand } from "../../domain/pasta/ports/in/pasta.add-pasta.command";
import { PastaGetPastaCommand } from "../../domain/pasta/ports/in/pasta.get-pasta.command";
import { PastaGetPastaPort } from "../../domain/pasta/ports/in/pasta.get-pasta.port";
import { PastaPersistenceAdapter } from "../pasta.persistence/pasta.persistence.adapter";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";


export class ClientPastaController {

    private static _pastaGetPastaPort: PastaGetPastaPort;
    constructor () {}

    public static async handle(user: ChatUserstate, message: string, pastaAdapter: PastaPersistenceAdapter): Promise<ClientResponseEntity> {
        this._pastaGetPastaPort = new PastaGetPastaPort(pastaAdapter);

        const simplifiedMessage: string = message.toLowerCase();
        const commandArgs :string[] = simplifiedMessage.split(' ');
        switch (commandArgs[1]) {
            case "add":
            case "добавить":
                if (user["display-name"] !== "thearturca") return new ClientResponseEntity(ClientResponseType.reply, user, "KEKYou")
                const newPasta = commandArgs.slice(2).join(" ");
                const addPastaCommand: AddPastaCommand = new AddPastaCommand(newPasta);
                this._pastaGetPastaPort.addPasta(addPastaCommand);
                return new ClientResponseEntity(ClientResponseType.reply, user, "Паста добавлена")
            default:
                const pastaName = commandArgs[1]
                const getPastaCommand: PastaGetPastaCommand = new PastaGetPastaCommand(pastaName)
                const getPastaResponse: PastaGetPastaResponseEntity = await this._pastaGetPastaPort.getPasta(getPastaCommand);
                return new ClientResponseEntity(ClientResponseType.reply, user, `Цитата великих №${getPastaResponse.pastaId}: ${getPastaResponse.pastaMessage}`);
        }
        
    }
}