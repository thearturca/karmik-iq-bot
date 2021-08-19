import { join } from "path";
import { createConnection } from "typeorm";
import { MemesTriggersOrmEntity } from "./memes.orm-entity";
import { MemesPersistenceAdapter } from "./memes.persistence.adapter";


export class MemesPersistenceModule {
        async connect (channel: string): Promise<MemesPersistenceAdapter> { 
                const connection = await createConnection({
                        type: "sqlite",
                        database: join (__dirname, "..", "..", "..", "..", "data", `${channel}-memes.db`),
                        name: channel + "-memes",
                        entities: [MemesTriggersOrmEntity],
                        synchronize: true,
                        logging: false
                });

                return new MemesPersistenceAdapter(connection.getRepository(MemesTriggersOrmEntity));
        }
}