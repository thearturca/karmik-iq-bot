import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.use-port";
import { IqUserPersistenceAdapter } from "../iq.user-persistence/iq.user-persistence.adapter";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientIqController {


    private static _iqTestUsePort: IqTestUsePort;
    constructor() {}
    static async handle(user: any, message: string, iqAdapter: IqUserPersistenceAdapter): Promise<ClientResponseEntity> {
        
        this._iqTestUsePort = new IqTestUsePort(iqAdapter, iqAdapter)
        const simplifiedMessage: string = message.toLocaleLowerCase();
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
                const result = await this._iqTestUsePort.test(command)
                const response = new ClientResponseEntity("reply", user, `${result.iq}`);
                return response;
            break;
            default:
                return new ClientResponseEntity("none")
            break;
        }

        
    }
}