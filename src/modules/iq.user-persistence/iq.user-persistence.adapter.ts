import { Repository } from "typeorm";
import { IqActivityWindowEntity } from "../../domain/IQ/entities/iq.activity-window.entity";
import { IqActivityEntity } from "../../domain/IQ/entities/iq.activity.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { order } from "../../domain/IQ/ports/in/iq.load-users-top.command";
import { IqLoadUserActivitiesPort } from "../../domain/IQ/ports/out/iq.load-user-activities.port";
import { IqLoadUserPort } from "../../domain/IQ/ports/out/iq.load-user.port";
import { IqLoadUsersTopPort } from "../../domain/IQ/ports/out/iq.load-users-top.port";
import { IqUpdateUserStatePort } from "../../domain/IQ/ports/out/iq.update-user.port";
import { IqUserActivityOrmEntity } from "./iq.user.activity.orm-entity";
import { IqUserMapper } from "./iq.user.mapper";
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserPersistenceAdapter implements IqLoadUserPort, IqUpdateUserStatePort, IqLoadUsersTopPort, IqLoadUserActivitiesPort {
    constructor(
        private readonly _iqUserRepository: Repository<IqUserOrmEntity>,
        private readonly _iqUserActivityRepository: Repository<IqUserActivityOrmEntity>
        ) {}

    async loadUser(username: string): Promise<IqUserEntity> {

        const user: IqUserOrmEntity | undefined = await this._iqUserRepository.findOne({username: username.toLowerCase()});
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

    async loadActivities(username: string): Promise<IqActivityWindowEntity> {
        const activities: IqUserActivityOrmEntity[] = await this._iqUserActivityRepository.find({username: username});
        return IqUserMapper.mapToActivityWindow(activities);
    }

    async loadUsers(take: number, order: order): Promise<IqUserEntity[]> {
        const usersOrm: IqUserOrmEntity[] = await this._iqUserRepository.find({
            order: {
                iq: order
            },
            take: take
        });

        let users: IqUserEntity[] = [];

        const usersOrmPromise = new Promise((resolve, reject) => {
            usersOrm.forEach(async (user, i) => {
                const activities: IqUserActivityOrmEntity[] = await this._iqUserActivityRepository.find({username: user.username});
                users.push(IqUserMapper.mapToUserEntity(user, activities));
                if (i === (usersOrm.length - 1)) {
                    resolve(true)
                };
            })
        });
        
        const waitPromise: boolean = await usersOrmPromise.then(() => {
            return true;
        });
        return users;
    }


}