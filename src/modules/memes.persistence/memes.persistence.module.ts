import { join } from "path";
import { createConnection } from "typeorm";
import { MemesOrmEntity} from "./memes.orm-entity";
import { MemesPersistenceAdapter } from "./memes.persistence.adapter";
import { MemesTriggersOrmEntity } from "./memes.triggers.orm-entity";


export class MemesPersistenceModule {
        async connect (channel: string): Promise<MemesPersistenceAdapter> { 
                const connection = await createConnection({
                        type: "sqlite",
                        database: join (__dirname, "..", "..", "..", "..", "data", `${channel}-memes.db`),
                        name: channel + "-memes",
                        entities: [MemesTriggersOrmEntity, MemesOrmEntity],
                        synchronize: true,
                        logging: false
                });

                return new MemesPersistenceAdapter(connection.getRepository(MemesTriggersOrmEntity), connection.getRepository(MemesOrmEntity));
        }
}