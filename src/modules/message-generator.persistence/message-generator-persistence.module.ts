import { join } from "path";
import { createConnection } from "typeorm";
import { MessageGeneratorPersistenceAdapter } from "./message-generator-persistence.adapter";
import { GeneratedMessageOrmEntity } from "./message-generator.generated-message.orm-entity";


export class MessageGeneratorPersistenceModule {
    async connect (): Promise<MessageGeneratorPersistenceAdapter> { 
        const connection = await createConnection({
                type: "sqlite",
                database: join (process.env.DATA_PATH || "./", "data", "message-generator.db"),
                name: "messageGenerator",
                entities: [GeneratedMessageOrmEntity],
                synchronize: true,
                logging: false
        });

        return new MessageGeneratorPersistenceAdapter(connection.getRepository(GeneratedMessageOrmEntity));
    }
}