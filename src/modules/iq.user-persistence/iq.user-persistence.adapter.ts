import { Repository } from "typeorm";
import { IqActivityEntity } from "../../domain/IQ/entities/iq.activity.entity";
import { IqEntity } from "../../domain/IQ/entities/iq.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqLoadUserPort } from "../../domain/IQ/ports/out/iq.load-user.port";
import { IqUpdateUserStatePort } from "../../domain/IQ/ports/out/iq.update-user.port";
import { IqUserActivityOrmEntity } from "./iq.user.activity.orm-entity";
import { IqUserMapper } from "./iq.user.mapper";
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserPersistenceAdapter implements IqLoadUserPort, IqUpdateUserStatePort {
    constructor(
        private readonly _iqUserRepository: Repository<IqUserOrmEntity>,
        private readonly _iqUserActivityRepository: Repository<IqUserActivityOrmEntity>
        ) {}

    async loadUser(username: string): Promise<IqUserEntity> {

        const user: IqUserOrmEntity | undefined = await this._iqUserRepository.findOne({username: username.toLocaleLowerCase()});
        if(user === undefined){
            const newUser: IqUserOrmEntity = new IqUserOrmEntity();
            newUser.username = username.toLowerCase();
            newUser.userdisplayname = username;
            newUser.iq = 100;
            await this._iqUserRepository.save((newUser))
            return this.loadUser(newUser.username);
        }
        const activities: IqUserActivityOrmEntity[] = await this._iqUserActivityRepository.find({username: username});
        return IqUserMapper.mapToUserEntity(user, activities)
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

    async updateActivities(user: IqUserEntity) {
        user.activityWindow.activities.forEach((activity: IqActivityEntity) => {
            if (activity.id === null) {
                this._iqUserActivityRepository.save(IqUserMapper.mapToActivityOrmEntity(activity))
            }
        })
    }


}