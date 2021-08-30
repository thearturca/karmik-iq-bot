import { join } from "path";
import { createConnection } from "typeorm";
import { CommandsOrmEntity } from "./commands.orm-entity";
import { CommandsPersistenceAdapter } from "./commands.persistence.adapter";


export class CommandsPersistenceModule {
        async connect (channel: string): Promise<CommandsPersistenceAdapter> { 
                const connection = await createConnection({
                        type: "sqlite",
                        database: join (process.env.DATA_PATH || "./", "data", `${channel}-commands.db`),
                        name: channel + "-commands",
                        entities: [CommandsOrmEntity],
                        synchronize: true,
                        logging: false
                });

                return new CommandsPersistenceAdapter(connection.getRepository(CommandsOrmEntity));
        }
}