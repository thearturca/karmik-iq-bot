import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.use-port";
import { StringGeneratorGenerateCommand } from "../../domain/string-generator/ports/in/string-generator.generate.command";
import { StringGeneratorGeneratePort } from "../../domain/string-generator/ports/in/string-generator.generate.port";
import { IqUserPersistenceAdapter } from "../iq.user-persistence/iq.user-persistence.adapter";
import { MessageGeneratorPersistenceAdapter } from "../message-generator.persistence/message-generator-persistence.adapter";
import { ClientResponseEntity } from "./client.response.entity";
import _ from "lodash";


export class ClientIqController {


    private static _iqTestUsePort: IqTestUsePort;
    private static _messageGeneratorGeneratePort: StringGeneratorGeneratePort;
    constructor() {}
    static async handle(user: any, message: string, messageGeneratorAdapter: MessageGeneratorPersistenceAdapter,iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter)
        this._messageGeneratorGeneratePort = new StringGeneratorGeneratePort(messageGeneratorAdapter);
        const simplifiedMessage: string = message.toLowerCase();
        const commandArgs :string[] = simplifiedMessage.slice(1).split(' ');

        switch(commandArgs[1]) {
            case "test":
                const { badges, 'badge-info': badgeInfo } = user;
                let isSub: boolean = false;
                let subMonths: number = 0;

                let isVIP: boolean = false;
                const isMod: boolean = user["mod"];

                if(badges) {
                    isSub = badges.subscriber || badges.founder;
                    isVIP = badges.vip || badges.founder;
                    if(isSub) {
                        subMonths = badgeInfo.subscriber || badgeInfo.founder;
                    }
                }
                const command: IqTestCommand = new IqTestCommand(user["display-name"], isVIP || isMod, isSub, subMonths, message);

                const result = await this._iqTestUsePort.test(command);

                const generateMessageCommand = new StringGeneratorGenerateCommand("iq", "test")

                const responseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(generateMessageCommand);

                const responseMessage = _.template(responseMessageTemplate)({iq: result.iq})
                const response = new ClientResponseEntity("reply", user, responseMessage + ` ${result.iq}`);
                return response;
            break;
            default:
                return new ClientResponseEntity("none")
            break;
        }

        
    }
}