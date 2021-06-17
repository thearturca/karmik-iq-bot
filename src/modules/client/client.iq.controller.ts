import { IqTestCommand } from "../../domain/IQ/ports/in/iq.test.command";
import { IqTestUseCase } from "../../domain/IQ/ports/in/iq.test.use-case";
import { ClientResponseEntity } from "./client.response.entity";


export class ClientIqController {
    static _iqTestUseCase: IqTestUseCase;
    constructor(private readonly _iqTestUseCase: IqTestUseCase) {}
    static async handle(user: any, message: string): Promise<ClientResponseEntity> {
        const simplifiedMessage: string = message.toLocaleLowerCase();
        const commandArgs :string[] = simplifiedMessage.slice(1).split(' ');

        switch(commandArgs[0]) {
            case "test":
                const command: IqTestCommand = new IqTestCommand(user, message);
                const result = await this._iqTestUseCase.test(command)
                const response = new ClientResponseEntity("reply", user, result);
                return response;
            break;
            default:

            break;
        }

        
    }
}