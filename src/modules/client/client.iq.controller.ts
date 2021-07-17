import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.use-port";
import { StringGeneratorGenerateCommand } from "../../domain/string-generator/ports/in/string-generator.generate.command";
import { StringGeneratorGeneratePort } from "../../domain/string-generator/ports/in/string-generator.generate.port";
import { IqUserPersistenceAdapter } from "../iq.user-persistence/iq.user-persistence.adapter";
import { MessageGeneratorPersistenceAdapter } from "../message-generator.persistence/message-generator-persistence.adapter";
import { ClientResponseEntity, ClientResponseType } from "./client.response.entity";
import { IqLoadUsersTopCommand } from "../../domain/IQ/ports/in/iq.load-users-top.command";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqLoadUsersTopUsePort } from "../../domain/IQ/ports/in/iq.load-users-top.use-port";
import { IqLoadUserUsePort } from "../../domain/IQ/ports/in/iq.load-user.use-port";
import { IqLoadUserCommand } from "../../domain/IQ/ports/in/iq.load-user.command";
import { IqTestResultEntity } from "../../domain/IQ/entities/iq.test-result.entity";
import { ChatUserstate } from "tmi.js-reply-fork";
import _ from "lodash";

export class ClientIqController {
    //importing ports for db
    private static _iqTestUsePort: IqTestUsePort;
    private static _iqLoadUsersTopUsePort: IqLoadUsersTopUsePort;
    private static _iqLoadUserUsePort: IqLoadUserUsePort;
    private static _messageGeneratorGeneratePort: StringGeneratorGeneratePort;

    constructor() {}

    static async handle(user: ChatUserstate, message: string, messageGeneratorAdapter: MessageGeneratorPersistenceAdapter, iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter);
        this._iqLoadUsersTopUsePort = new IqLoadUsersTopUsePort(iqAdapter);
        this._iqLoadUserUsePort = new IqLoadUserUsePort(iqAdapter);
        this._messageGeneratorGeneratePort = new StringGeneratorGeneratePort(messageGeneratorAdapter);

        const simplifiedMessage: string = message.toLowerCase();
        const commandArgs :string[] = simplifiedMessage.slice(1).split(' ');
        switch(commandArgs[1]) {
            case "test":
                return await this._test(user, message);
            case "top":
                return await this._top(user, message, commandArgs);
            case "antitop":
                return await this._antitop(user, message, commandArgs);
            case "stats":
                return await this._stats(user, message, commandArgs);
            default:
                return await this._default(user, message, commandArgs)
        }

        
    }

    private static async _test(user: ChatUserstate, message: string): Promise<ClientResponseEntity> {
        const { badges, 'badge-info': badgeInfo } = user;
        let isSub: boolean = false;
        let subMonths: number = 0;
        let isVIP: boolean = false;
        const isMod: boolean = user["mod"] || false;
        if(badges) {
            isSub = Boolean(badges.subscriber) || Boolean(badges.founder);
            if(isSub) {
                subMonths = Number(badgeInfo?.subscriber) || Number(badgeInfo?.founder);
            }
        }
        console.log("is mod " + isMod, "is vip" + isVIP, "is sub" +isSub, "sub month" +subMonths)
        const iqTestCommand: IqTestCommand = new IqTestCommand(user["display-name"] || "anonimus", isVIP || isMod, isSub, subMonths, message);
        const iqTestResult: IqTestResultEntity = await this._iqTestUsePort.test(iqTestCommand);
        if(iqTestResult.status){
            //generate message for response
            const iqTestGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test")
            const iqTestResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestGenerateMessageCommand);
            const iqTestResponseMessage = _.template(iqTestResponseMessageTemplate)({iq: iqTestResult.iq});

            let iqTestTryNumberResponseMessage: string = "";
            if(iqTestResult.tryNumber < iqTestResult.maxTryNumber) {
                //generate message for response
                const iqTestTryNumberGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test-try")
                const iqTestTryNumberResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestTryNumberGenerateMessageCommand);
                iqTestTryNumberResponseMessage = _.template(iqTestTryNumberResponseMessageTemplate)({tryLeft: iqTestResult.maxTryNumber - iqTestResult.tryNumber});
            } else {
                //generate message for response
                const iqTestTryNumberGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test-no-tries")
                const iqTestTryNumberResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestTryNumberGenerateMessageCommand);
                iqTestTryNumberResponseMessage = _.template(iqTestTryNumberResponseMessageTemplate)();
            }

            const iqTestResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTestResponseMessage + " " + iqTestTryNumberResponseMessage);
            return iqTestResponse;  
        } else {
                //generate message for response
            const iqTestCDGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "test-cd")
            const iqTestCDResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestCDGenerateMessageCommand);

            const userCDinfo = Math.floor(((iqTestResult.lastTryTimestamp + 9 * 1000 * 60 * 60) - Date.now()) / 1000);
            const userCdHours = Math.floor((userCDinfo / 60) / 60);
            const userCdMinutes = Math.floor((userCDinfo / 60) - (userCdHours * 60));
            
            const iqTestCDResponseMessage = _.template(iqTestCDResponseMessageTemplate)({h: userCdHours, m: userCdMinutes});

            const iqTestGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default")
            const iqTestResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTestGenerateMessageCommand);
            const iqTestResponseMessage = _.template(iqTestResponseMessageTemplate)({iq: iqTestResult.iq});

            const iqTestResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTestCDResponseMessage + " " + iqTestResponseMessage);
            return iqTestResponse;
        }
    }

    private static async _top(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        const topTake: number = Number(commandArgs[2]);
        const iqTopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(topTake, "DESC");
        const iqTopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqTopCommand);
        if (iqTopResult.length === 0 || iqTopResult === undefined) {
            const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top-none")
            const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);
            const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)()
            const iqTopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTopResponseMessage);
            return iqTopResponse;
        }
        let topList: string = "";
        iqTopResult.forEach((user, i) => {
            topList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqTopResult.length - 1)) ? ". " : ", "}`
        })
        //generate message for response
        const iqTopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "top")
        const iqTopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqTopGenerateMessageCommand);
        const iqTopResponseMessage: string = _.template(iqTopResponseMessageTemplate)({list: topList, take: iqTopResult.length})
        const iqTopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTopResponseMessage);
        return iqTopResponse;
    }

    private static async _antitop(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        const antitopTake: number = Number(commandArgs[2]);
        const iqAntitopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(antitopTake, "ASC");
        const iqAntitopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqAntitopCommand);
        if (iqAntitopResult.length === 0 || iqAntitopResult === undefined) {
            //generate message for response
            const iqAntitopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "antitop-none")
            const iqAntitopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqAntitopGenerateMessageCommand);
            const iqAntitopResponseMessage: string = _.template(iqAntitopResponseMessageTemplate)()
            const iqAntitopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqAntitopResponseMessage);
            return iqAntitopResponse;
        }
        let antitopList: string = "";
        iqAntitopResult.forEach((user, i) => {
            antitopList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqAntitopResult.length - 1)) ? ". " : ", "}`
        })
        //generate message for response
        const iqAntitopGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "antitop")
        const iqAntitopResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(iqAntitopGenerateMessageCommand);
        const iqAntitopResponseMessage: string = _.template(iqAntitopResponseMessageTemplate)({list: antitopList, take: iqAntitopResult.length});
        console.log(iqAntitopResponseMessage);
        const iqAntitopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqAntitopResponseMessage);
        return iqAntitopResponse;
    }

    private static async _default(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
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
                const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
                return getIqResponse;
            }

            const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default-user")
            const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
            const getIqResponseMessage: string = _.template(getIqResponseMessageTemplate)({username: commandUser.username, iq: commandUser.iq});
            //generate message for response
            const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
            const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
            const getCommandsList: string = _.template(getCommandsListTemplate)();
            const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
            return getIqResponse;
        }
        const loadUserCommand = new IqLoadUserCommand(user["display-name"] || "anonimus");
        const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
        let getIqResponseMessage: string = "";
        if (commandUser !== null) {
            const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default")
            const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
            getIqResponseMessage = _.template(getIqResponseMessageTemplate)({iq: commandUser.iq});
        }
        //generate commands list message for response
        const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
        const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
        const getCommandsList: string = _.template(getCommandsListTemplate)();
        const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
        return getIqResponse;
    }

    private static async _stats(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        if (commandArgs[2] !== undefined) {
            const commandUsername = commandArgs[2].startsWith("@") ? commandArgs[2].substr(1) : commandArgs[2];
            const loadUserCommand = new IqLoadUserCommand(commandUsername);
            const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
            if (commandUser === null) {
                const getIqGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "default-user-null")
                const getIqResponseMessageTemplate: string = await this._messageGeneratorGeneratePort.generate(getIqGenerateMessageCommand);
                const getIqResponseMessage: string = _.template(getIqResponseMessageTemplate)({username: commandUsername});
                //generate commands list message for response
                const getCommandsListCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand("iq", "commands-list");
                const getCommandsListTemplate: string = await this._messageGeneratorGeneratePort.generate(getCommandsListCommand);
                const getCommandsList: string = _.template(getCommandsListTemplate)();
                const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
                return getIqResponse;
            }
            const getIqStatsResponseMessage: string = _.template(await this._getMessage("iq", "stats-nickname"))({username: commandUser.username, iq: commandUser.iq});
            //generate commands list message for response
            const getCommandsList: string = _.template(await this._getMessage("iq", "commands-list"))();
            const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqStatsResponseMessage + ' ' + getCommandsList);
            return getIqResponse;
        }

        return new ClientResponseEntity(ClientResponseType.reply, user, " ")
    }

    private static async _getMessage(type: string, subType: string): Promise<string> {
        const getGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand(type, subType);
        return await this._messageGeneratorGeneratePort.generate(getGenerateMessageCommand);
        
    }
}