import { createConnection } from "typeorm";
import { IqUserPersistenceAdapter } from "./iq.user-persistence.adapter";
import { join } from 'path';
import { IqUserOrmEntity } from "./iq.user.orm-entity";


export class IqUserPersistenceModuel {
    async connect (): Promise<IqUserPersistenceAdapter> { 
        const connection = await createConnection({
                type: "sqlite",
                database: join (__dirname, "..", "..", "..", "..", "data", "iq.db"),
                entities: [IqUserOrmEntity],
                logging: false
        });

        return new IqUserPersistenceAdapter(connection.getRepository(IqUserOrmEntity));
    }
}