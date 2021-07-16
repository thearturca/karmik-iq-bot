import { IqTestResultEntity } from "../../entities/iq.test-result.entity";
import { IqTestCommand } from "./iq.test.command";


export interface IqTestUseCase {
    test(command: IqTestCommand): Promise<IqTestResultEntity>
}