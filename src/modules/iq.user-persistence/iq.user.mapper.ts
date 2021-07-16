import { IqActivityWindowEntity } from "../../domain/IQ/entities/iq.activity-window.entity";
import { IqActivityEntity } from "../../domain/IQ/entities/iq.activity.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqUserActivityOrmEntity } from "./iq.user.activity.orm-entity";
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserMapper {
    static mapToUserEntity(user: IqUserOrmEntity, activities: IqUserActivityOrmEntity[]): IqUserEntity {
        const activityWindow: IqActivityWindowEntity = this.mapToActivityWindow(activities)
        return new IqUserEntity(user.username, activityWindow, user.iq, user.id, user.maxTryNumber);
    }

    static mapToActivityWindow(activities: IqUserActivityOrmEntity[]): IqActivityWindowEntity {
        const activityWindowEntity = new IqActivityWindowEntity();
        activities.forEach((activity) => {
            const activityEntity: IqActivityEntity = new IqActivityEntity(
                activity.username,
                new Date(activity.timestamp),
                activity.iq,
                activity.id
            )
            activityWindowEntity.addActivity(activityEntity);
        })
        return activityWindowEntity;
    }

    static mapToUserOrmEntity(user: IqUserEntity): IqUserOrmEntity {
        const iqUserOrmEntity: IqUserOrmEntity = new IqUserOrmEntity;
        iqUserOrmEntity.username = user.username.toLowerCase();
        iqUserOrmEntity.userdisplayname = user.username;
        iqUserOrmEntity.iq = user.iq;
        iqUserOrmEntity.maxTryNumber = user.maxTryNumber;
        if (user.id !== null) {
            iqUserOrmEntity.id = user.id;
        }
        return iqUserOrmEntity;
    }

    static mapToActivityOrmEntity(activity: IqActivityEntity): IqUserActivityOrmEntity {
        const iqUserActivityOrmEntity: IqUserActivityOrmEntity = new IqUserActivityOrmEntity();
        iqUserActivityOrmEntity.username = activity.username;
        iqUserActivityOrmEntity.timestamp = activity.timestamp.getTime();
        iqUserActivityOrmEntity.iq = activity.iq;
        if (activity.id !== null) {
            iqUserActivityOrmEntity.id = activity.id;
        }
        return iqUserActivityOrmEntity;
    }
}