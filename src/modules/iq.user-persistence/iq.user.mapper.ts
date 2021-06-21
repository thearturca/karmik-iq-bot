import { IqEntity } from "../../domain/IQ/entities/iq.entity";
import { IqUserEntity } from "../../domain/IQ/entities/iq.user.entity";
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserMapper {
    static mapToUserEntity(user: IqUserOrmEntity): IqUserEntity {
        return new IqUserEntity(user.username, IqEntity.of(user.iq), user.id);
    }

    static mapToUserOrmEntity(user: IqUserEntity): IqUserOrmEntity {
        const iqUserOrmEntity: IqUserOrmEntity = new IqUserOrmEntity;
        iqUserOrmEntity.username = user.username.toLocaleLowerCase();
        iqUserOrmEntity.userdisplayname = user.username;
        iqUserOrmEntity.iq = user.iq;
        if (user.id !== null) {
            iqUserOrmEntity.id = user.id;
        }
        return iqUserOrmEntity;
    }
}