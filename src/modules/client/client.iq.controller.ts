import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.use-port";
import { StringGeneratorGenerateCommand } from "../../domain/string-generator/ports/in/string-generator.generate.command";
import { StringGeneratorGeneratePort } from "../../domain/string-generator/ports/in/string-generator.generate.port";
import { IqUserPersistenceAdapter } from "../iq.user-persistence/iq.user-persistence.adapter";
import { MessageGeneratorPersistenceAdapter } from "../message-generator.persistence/message-generator-persistence.adapter";
import { ClientResponseEntity } from "./client.response.entity";
import { IqLoadUsersTopCommand } from "../../domain/IQ/ports/in/iq.load-users-top.command";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqLoadUsersTopUsePort } from "../../domain/IQ/ports/in/iq.load-users-top.use-port";
import { IqLoadUserUsePort } from "../../domain/IQ/ports/in/iq.load-user.use-port";
import { IqLoadUserCommand } from "../../domain/IQ/ports/in/iq.load-user.command";
import _ from "lodash";


export class ClientIqController {
    //importing ports for db
    private static _iqTestUsePort: IqTestUsePort;
    private static _iqLoadUsersTopUsePort: IqLoadUsersTopUsePort;
    private static _iqLoadUserUsePort: IqLoadUserUsePort;
    private static _messageGeneratorGeneratePort: StringGeneratorGeneratePort;

    constructor() {}

    static async handle(user: any, message: string, messageGeneratorAdapter: MessageGeneratorPersistenceAdapter, iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter);
        this._iqLoadUsersTopUsePort = new IqLoadUsersTopUsePort(iqAdapter);
        this._iqLoadUserUsePort = new IqLoadUserUsePort(iqAdapter);
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
                //generate message for response
                const iqTestGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test")
                const iqTestResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestGenerateMessageCommand);
                const iqTestResponseMessage = _.template(iqTestResponseMessageTemplate)({iq: iqTestResult.iq})
                const iqTestResponse = new ClientResponseEntity("reply", user, iqTestResponseMessage);
                return iqTestResponse;
            break;
            case "top":
                const topTake: number = Number(commandArgs[2]);
                const iqTopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(topTake, "DESC");
                const iqTopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqTopCommand);
                if (iqTopResult.length === 0 || iqTopResult === undefined) {
                    const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top-none")
                    const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);
                    const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)()
                    const iqTopResponse = new ClientResponseEntity("reply", user, iqTopResponseMessage);
                    return iqTopResponse;
                }
                let topList: string = "";
                iqTopResult.forEach((user, i) => {
                    topList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqTopResult.length - 1)) ? ". " : ", "}`
                })
                //generate message for response
                const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top")
                const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);
                const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)({list: topList, take: topTake})
                const iqTopResponse = new ClientResponseEntity("reply", user, iqTopResponseMessage);
                return iqTopResponse;

            break;
            case "antitop":
                const antitopTake: number = Number(commandArgs[2]);
                const iqAntitopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(antitopTake, "ASC");
                const iqAntitopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqAntitopCommand);
                if (iqAntitopResult.length === 0 || iqAntitopResult === undefined) {
                    //generate message for response
                    const iqAntitopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top-none")
                    const iqAntitopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqAntitopGenerateMessageCommand);
                    const iqAntitopResponseMessage: string = _.template(iqAntitopResponseMessageTemplate)()
                    const iqAntitopResponse = new ClientResponseEntity("reply", user, iqAntitopResponseMessage);
                    return iqAntitopResponse;
                }
                let antitopList: string = "";
                iqAntitopResult.forEach((user, i) => {
                    antitopList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqAntitopResult.length - 1)) ? ". " : ", "}`
                })
                //generate message for response
                const iqAntitopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top")
                const iqAntitopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqAntitopGenerateMessageCommand);
                const iqAntitopResponseMessage: string = _.template(iqAntitopResponseMessageTemplate)({list: antitopList, take: antitopTake})
                const iqAntitopResponse = new ClientResponseEntity("reply", user, iqAntitopResponseMessage);
                return iqAntitopResponse;
            break;
            default:
                //check for username
                if (commandArgs[1] !== undefined) {
                    const commandUsername = commandArgs[1].startsWith("@") ? commandArgs[1].substr(1) : commandArgs[1];
                    const loadUserCommand = new IqLoadUserCommand(commandUsername);
                    const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
                    if (commandUser === null) {
                        const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default-user-null")
                        const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
                        const getIqResponseMessage: string = _.template(getIqResponseMessageTemplate)({username: commandUsername});
                        //generate message for response
                        const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
                        const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
                        const getCommandsList: string = _.template(getCommandsListTemplate)();
                        const getIqResponse = new ClientResponseEntity("reply", user, getIqResponseMessage + ' ' + getCommandsList);
                        return getIqResponse;

                    }

                    const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default-nickname")
                    const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
                    const getIqResponseMessage: string = _.template(getIqResponseMessageTemplate)({username: commandUser.username, iq: commandUser.iq});
                    //generate message for response
                    const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
                    const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
                    const getCommandsList: string = _.template(getCommandsListTemplate)();
                    const getIqResponse = new ClientResponseEntity("reply", user, getIqResponseMessage + ' ' + getCommandsList);
                    return getIqResponse;
                }
                const loadUserCommand = new IqLoadUserCommand(user["display-name"]);
                const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
                let getIqResponseMessage: string = "";
                if (commandUser !== null) {
                    const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default")
                    const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
                    getIqResponseMessage = _.template(getIqResponseMessageTemplate)({iq: commandUser.iq});
                }
                //generate message for response
                const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
                const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
                const getCommandsList: string = _.template(getCommandsListTemplate)();
                const getIqResponse = new ClientResponseEntity("reply", user, getIqResponseMessage + ' ' + getCommandsList);
                return getIqResponse;
            break;
        }

        
    }
}