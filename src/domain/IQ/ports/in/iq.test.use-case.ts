import { IqTestCommand } from "./iq.test.command";


export interface IqTestUseCase {
    test(command: IqTestCommand): Promise<boolean>
}