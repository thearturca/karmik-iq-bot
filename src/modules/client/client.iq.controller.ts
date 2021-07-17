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
import _, { values } from "lodash";
import { IqActivityWindowEntity } from "../../domain/IQ/entities/iq.activity-window.entity";
import { IqLoadAllUsersActivitiesUsePort } from "../../domain/IQ/ports/in/iq.load-all-users-activities.use-port";
import { IqLoadAllUsersUsePort } from "../../domain/IQ/ports/in/iq.load-all-users.use-port";

export class ClientIqController {
    //importing ports for db
    private static _iqTestUsePort: IqTestUsePort;
    private static _iqLoadUsersTopUsePort: IqLoadUsersTopUsePort;
    private static _iqLoadUserUsePort: IqLoadUserUsePort;
    private static _iqLoadAllUsersActivitiesUsePort: IqLoadAllUsersActivitiesUsePort;
    private static _iqLoadAllUsersUsePort: IqLoadAllUsersUsePort;
    private static _messageGeneratorGeneratePort: StringGeneratorGeneratePort;

    constructor() {}

    static async handle(user: ChatUserstate, message: string, messageGeneratorAdapter: MessageGeneratorPersistenceAdapter, iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter);
        this._iqLoadUsersTopUsePort = new IqLoadUsersTopUsePort(iqAdapter);
        this._iqLoadUserUsePort = new IqLoadUserUsePort(iqAdapter);
        this._iqLoadAllUsersActivitiesUsePort = new IqLoadAllUsersActivitiesUsePort(iqAdapter);
        this._iqLoadAllUsersUsePort = new IqLoadAllUsersUsePort(iqAdapter);
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
        const iqTestCommand: IqTestCommand = new IqTestCommand(user["display-name"] || "anonimus", isVIP || isMod, isSub, subMonths, message);
        const iqTestResult: IqTestResultEntity = await this._iqTestUsePort.test(iqTestCommand);
        if(iqTestResult.status){
            //generate message for response
            const iqTestResponseMessage = _.template(await this._getMessageTemplate("iq", "test"))({iq: iqTestResult.iq});

            let iqTestTryNumberResponseMessage: string = "";
            if(iqTestResult.tryNumber < iqTestResult.maxTryNumber) {
                //generate message for response
                iqTestTryNumberResponseMessage = _.template(await this._getMessageTemplate("iq", "test-try"))({
                    tryLeft: iqTestResult.maxTryNumber - iqTestResult.tryNumber
                });
            } else {
                //generate message for response
                iqTestTryNumberResponseMessage = _.template(await this._getMessageTemplate("iq", "test-no-tries"))();
            }

            const iqTestResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTestResponseMessage + " " + iqTestTryNumberResponseMessage);
            return iqTestResponse;  
        } else {
            //generate message for response
            const userCDinfo = Math.floor(((iqTestResult.lastTryTimestamp + 9 * 1000 * 60 * 60) - Date.now()) / 1000);
            const userCdHours = Math.floor((userCDinfo / 60) / 60);
            const userCdMinutes = Math.floor((userCDinfo / 60) - (userCdHours * 60));
            
            const iqTestCDResponseMessage = _.template(await this._getMessageTemplate("iq", "test-cd"))({
                h: userCdHours,
                m: userCdMinutes
            });

            const iqTestResponseMessage = _.template(await this._getMessageTemplate("iq", "default"))({iq: iqTestResult.iq});

            const iqTestResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTestCDResponseMessage + " " + iqTestResponseMessage);
            return iqTestResponse;
        }
    }

    private static async _top(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        const topTake: number = Number(commandArgs[2]);
        const iqTopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(topTake, "DESC");
        const iqTopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqTopCommand);
        if (iqTopResult.length === 0 || iqTopResult === undefined) {
            const iqTopResponseMessage: string = _.template(await this._getMessageTemplate("iq", "top-none"))()
            const iqTopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTopResponseMessage);
            return iqTopResponse;
        }
        let topList: string = "";
        iqTopResult.forEach((user, i) => {
            topList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqTopResult.length - 1)) ? ". " : ", "}`
        })
        //generate message for response
        const iqTopResponseMessage: string = _.template(await this._getMessageTemplate("iq", "top"))({
            list: topList,
            take: iqTopResult.length
        })
        const iqTopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqTopResponseMessage);
        return iqTopResponse;
    }

    private static async _antitop(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        const antitopTake: number = Number(commandArgs[2]);
        const iqAntitopCommand: IqLoadUsersTopCommand = new IqLoadUsersTopCommand(antitopTake, "ASC");
        const iqAntitopResult: IqUserEntity[] = await this._iqLoadUsersTopUsePort.loadUsersTop(iqAntitopCommand);
        if (iqAntitopResult.length === 0 || iqAntitopResult === undefined) {
            //generate message for response
            const iqAntitopResponseMessage: string = _.template(await this._getMessageTemplate("iq", "antitop-none"))()
            const iqAntitopResponse = new ClientResponseEntity(ClientResponseType.reply, user, iqAntitopResponseMessage);
            return iqAntitopResponse;
        }
        let antitopList: string = "";
        iqAntitopResult.forEach((user, i) => {
            antitopList += `${i+1}. ${user.iq} IQ - ${user.username}${(i === (iqAntitopResult.length - 1)) ? ". " : ", "}`
        })
        //generate message for response
        const iqAntitopResponseMessage: string = _.template(await this._getMessageTemplate("iq", "antitop"))({
            list: antitopList,
            take: iqAntitopResult.length
        });
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
                const getIqResponseMessage: string = _.template(await this._getMessageTemplate("iq", "default-user-null"))({username: commandUsername});
                //generate message for response
                const getCommandsList: string = _.template(await this._getMessageTemplate("iq", "commands-list"))();
                const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
                return getIqResponse;
            }
            const getIqResponseMessage: string = _.template(await this._getMessageTemplate("iq", "default-user"))({
                username: commandUser.username,
                iq: commandUser.iq
            });
            //generate message for response
            const getCommandsList: string = _.template(await this._getMessageTemplate("iq", "commands-list"))();
            const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
            return getIqResponse;
        }
        const loadUserCommand = new IqLoadUserCommand(user["display-name"] || "anonimus");
        const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
        let getIqResponseMessage: string = "";
        if (commandUser !== null) {
            getIqResponseMessage = _.template(await this._getMessageTemplate("iq", "default"))({iq: commandUser.iq});
        }
        //generate commands list message for response
        const getCommandsList: string = _.template(await this._getMessageTemplate("iq", "commands-list"))();
        const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
        return getIqResponse;
    }

    private static async _stats(user: ChatUserstate, message: string, commandArgs: string[]): Promise<ClientResponseEntity> {
        if (commandArgs[2] !== undefined) {
            const commandUsername = commandArgs[2].startsWith("@") ? commandArgs[2].substr(1) : commandArgs[2];
            const loadUserCommand = new IqLoadUserCommand(commandUsername);
            const commandUser = await this._iqLoadUserUsePort.loadUser(loadUserCommand);
            if (commandUser === null) {
                const getIqResponseMessage: string = _.template(await this._getMessageTemplate("iq", "default-user-null"))({
                    username: commandUsername
                });
                //generate commands list message for response
                const getCommandsList: string = _.template(await this._getMessageTemplate("iq", "commands-list"))();
                const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqResponseMessage + ' ' + getCommandsList);
                return getIqResponse;
            }
            commandUser

            const last24HTestsCount: number = commandUser.activityWindow.activities.map((value) => {
                const curTime = Date.now();
                if(value.timestamp.getTime() > (curTime - 9 * 1000 * 60 * 60)){
                    return value.timestamp.getTime();
                }
            }).length;
            const getAllUserIq: number[] = commandUser.activityWindow.activities.map(val => val.iq);
            const avgIq: number = Math.floor(getAllUserIq.reduce((a,b)=> {return a+b}) / getAllUserIq.length);

            const getIqStatsResponseMessage: string = _.template(await this._getMessageTemplate("iq", "stats-user"))({
                avgIq: avgIq,
                userTestsCount: commandUser.activityWindow.activities.length,
                last24HTestsCount: last24HTestsCount 
            });
            const getIqResponse = new ClientResponseEntity(ClientResponseType.reply, user, getIqStatsResponseMessage);
            return getIqResponse;
        }
        const usersCount: number = (await this._iqLoadAllUsersUsePort.loadAllUsers()).length;
        const getAllTests: IqActivityWindowEntity = await this._iqLoadAllUsersActivitiesUsePort.loadAllUsersActivities();
        const last24HTestsCount: number = getAllTests.activities.map((value) => {
            const curTime = Date.now();
            if(value.timestamp.getTime() > (curTime - 9 * 1000 * 60 * 60)){
                return value.timestamp.getTime();
            }
        }).length;
        const getAllIq: number[] = getAllTests.activities.map(val => val.iq);
        const avgIq: number = Math.floor(getAllIq.reduce((a,b)=> {return a+b}) / getAllIq.length);

        const getIqStatsResponseMessage: string = _.template(await this._getMessageTemplate("iq", "stats"))({
            avgIq: avgIq,
            usersCount: usersCount,
            last24HTestsCount: last24HTestsCount
        });
        return new ClientResponseEntity(ClientResponseType.reply, user, getIqStatsResponseMessage)
    }

    private static async _getMessageTemplate(type: string, subType: string): Promise<string> {
        const getGenerateMessageCommand: StringGeneratorGenerateCommand = new StringGeneratorGenerateCommand(type, subType);
        return await this._messageGeneratorGeneratePort.generate(getGenerateMessageCommand);
        
    }
}