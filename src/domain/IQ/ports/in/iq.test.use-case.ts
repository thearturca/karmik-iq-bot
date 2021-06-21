import { IqUserEntity } from "../../entities/iq.user.entity";
import { IqTestCommand } from "./iq.test.command";


export interface IqTestUseCase {
    test(command: IqTestCommand): Promise<IqUserEntity>
}