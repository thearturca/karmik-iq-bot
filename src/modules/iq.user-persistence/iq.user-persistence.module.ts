import { createConnection } from "typeorm";
import { IqUserPersistenceAdapter } from "./iq.user-persistence.adapter";
import { join } from 'path';
import { IqUserOrmEntity } from "./iq.user.orm-entity";
import { IqUserActivityOrmEntity } from "./iq.user.activity.orm-entity";


export class IqUserPersistenceModule {
    async connect (channel: string): Promise<IqUserPersistenceAdapter> { 
        const connection = await createConnection({
                type: "sqlite",
                database: join (process.env.DATA_PATH || "./", "data", `${channel}-iq.db`),
                name: channel + "-Iq",
                entities: [IqUserOrmEntity, IqUserActivityOrmEntity],
                synchronize: true,
                logging: false
        });

        return new IqUserPersistenceAdapter(connection.getRepository(IqUserOrmEntity), connection.getRepository(IqUserActivityOrmEntity));
    }
}