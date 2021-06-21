import { Repository } from "typeorm";
import { IqEntity } from "../../domain/IQ/entities/iq.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqLoadUserPort } from "../../domain/IQ/ports/out/iq.load-user.port";
import { IqUpdateUserStatePort } from "../../domain/IQ/ports/out/iq.update-user.port";
import { IqUserMapper } from "./iq.user.mapper";
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserPersistenceAdapter implements IqLoadUserPort, IqUpdateUserStatePort {
    constructor( private readonly _iqUserRepository: Repository<IqUserOrmEntity>) {}

    async loadUser(username: string): Promise<IqUserEntity> {

        const user: IqUserOrmEntity | undefined = await this._iqUserRepository.findOne({username: username.toLocaleLowerCase()});
        if(user === undefined){
            const newUser: IqUserEntity = new IqUserEntity(username, IqEntity.of(0));
            await this._iqUserRepository.save(IqUserMapper.mapToUserOrmEntity(newUser))
            return this.loadUser(newUser.username);
        }
        return IqUserMapper.mapToUserEntity(user)
    }

    async updateUser(user: IqUserEntity) {
        const username: string = user.username.toLowerCase();
        const findUser: IqUserOrmEntity | undefined  = await this._iqUserRepository.findOne({username: username});
        if (findUser === undefined) {
            this._iqUserRepository.save(IqUserMapper.mapToUserOrmEntity(user))
            return;
        }

        if(findUser.id !== undefined) {
            this._iqUserRepository.save(IqUserMapper.mapToUserOrmEntity(user))
        }
    }
}