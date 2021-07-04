import { createConnection } from "typeorm";
import { IqUserPersistenceAdapter } from "./iq.user-persistence.adapter";
import { join } from 'path';
import { IqUserOrmEntity } from "./iq.user.orm-entity";
import { IqUserActivityOrmEntity } from "./iq.user.activity.orm-entity";


export class IqUserPersistenceModuel {
    async connect (channel: string): Promise<IqUserPersistenceAdapter> { 
        const connection = await createConnection({
                type: "sqlite",
                database: join (__dirname, "..", "..", "..", "..", "data", `${channel}-iq.db`),
                name: "Iq",
                entities: [IqUserOrmEntity, IqUserActivityOrmEntity],
                synchronize: true,
                logging: true
        });

        return new IqUserPersistenceAdapter(connection.getRepository(IqUserOrmEntity), connection.getRepository(IqUserActivityOrmEntity));
    }
}