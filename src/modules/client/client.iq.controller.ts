import { IqEntity } from "../../domain/IQ/entities/iq.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUseCase } from "../../domain/IQ/ports/in/iq.test.use-case";
import { IqTestUsePort } from "../../domain/IQ/ports/in/iq.test.user-port";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientIqController {
    private static _iqTestUsePort: IqTestUsePort = new IqTestUsePort;
    constructor() {}
    static async handle(user: any, message: string): Promise<ClientResponseEntity> {
        const simplifiedMessage: string = message.toLocaleLowerCase();
        const commandArgs :string[] = simplifiedMessage.slice(1).split(' ');

        switch(commandArgs[1]) {
            case "test":
                const command: IqTestCommand = new IqTestCommand(new IqUserEntity(user["display-name"], IqEntity.of(0), 0, false, false, 0), message);
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