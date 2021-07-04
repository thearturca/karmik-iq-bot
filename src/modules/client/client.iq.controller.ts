import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.use-port";
import { StringGeneratorGenerateCommand } from "../../domain/string-generator/ports/in/string-generator.generate.command";
import { StringGeneratorGeneratePort } from "../../domain/string-generator/ports/in/string-generator.generate.port";
import { IqUserPersistenceAdapter } from "../iq.user-persistence/iq.user-persistence.adapter";
import { MessageGeneratorPersistenceAdapter } from "../message-generator.persistence/message-generator-persistence.adapter";
import { ClientResponseEntity } from "./client.response.entity";

import _ from "lodash";
import { IqLoadUsersTopCommand } from "../../domain/IQ/ports/in/iq.load-users-top.command";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqLoadUsersTopUsePort } from "../../domain/IQ/ports/in/iq.load-users-top.use-port";


export class ClientIqController {


    private static _iqTestUsePort: IqTestUsePort;
    private static _iqLoadUsersTopUsePort: IqLoadUsersTopUsePort;
    private static _messageGeneratorGeneratePort: StringGeneratorGeneratePort;
    constructor() {}
    static async handle(user: any, message: string, messageGeneratorAdapter: MessageGeneratorPersistenceAdapter,iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter);
        this._iqLoadUsersTopUsePort = new IqLoadUsersTopUsePort(iqAdapter);
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
                const iqTestCommand: IqTestCommand = new IqTestCommand(user["display-name"], isVIP || isMod, isSub, subMonths, message);

                const iqTestResult = await this._iqTestUsePort.test(iqTestCommand);

                const iqTestGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test")

                const iqTestResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestGenerateMessageCommand);

                const iqTestResponseMessage = _.template(iqTestResponseMessageTemplate)({iq: iqTestResult.iq})
                const iqTestResponse = new ClientResponseEntity("reply", user, iqTestResponseMessage);
                return iqTestResponse;
            break;
            case "top":
                let take: number = Number(commandArgs[2]);
                if (Number.isNaN(take) || take === undefined) {
                    take = 5;
                }
                if (take > 10) {
                    take = 10;
                }

                const iqTopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(take, "DESC");
                const iqTopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqTopCommand);
                if (iqTopResult.length === 0 || iqTopResult === undefined) {
                    const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top-none")

                    const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);

                    const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)()
                    const iqTopResponse = new ClientResponseEntity("reply", user, iqTopResponseMessage);
                    return iqTopResponse;
                }
                let list: string = "";
                iqTopResult.forEach((user, i) => {
                    list += `${i+1}. ${user.username}: ${user.iq} IQ${(i === (iqTopResult.length - 1)) ? ". " : ", "}`
                })
                const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top")

                const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);

                const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)({list: list, take: take})
                const iqTopResponse = new ClientResponseEntity("reply", user, iqTopResponseMessage);
                return iqTopResponse;

            break;
            default:
                return new ClientResponseEntity("none")
            break;
        }

        
    }
}