import { join } from "path";
import { createConnection } from "typeorm";
import { PastaOrmEntity } from "./pasta.orm-entity";
import { PastaPersistenceAdapter } from "./pasta.persistence.adapter";


export class PastaPersistenceModule {
        async connect (channel: string): Promise<PastaPersistenceAdapter> { 
                const connection = await createConnection({
                        type: "sqlite",
                        database: join (__dirname, "..", "..", "..", "..", "data", `${channel}-pasta.db`),
                        name: channel + "-pasta",
                        entities: [PastaOrmEntity],
                        synchronize: true,
                        logging: false
                });

                return new PastaPersistenceAdapter(connection.getRepository(PastaOrmEntity));
        }
}