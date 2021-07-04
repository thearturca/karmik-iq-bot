import { IqUserEntity } from "../../entities/iq.user.entity";
import { IqLoadUserCommand } from "./iq.load-user.command";


export interface IqLoadUserUseCase {
    loadUser(command: IqLoadUserCommand): Promise<IqUserEntity>;
}