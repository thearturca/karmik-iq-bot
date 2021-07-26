import { Repository } from "typeorm";
import { CommandsLoadCommandPort } from "../../domain/commands/ports/out/commands.load-command.port";
import { CommandsOrmEntity } from "./commands.orm-entity";


export class CommandsPersistenceAdapter implements CommandsLoadCommandPort {
    constructor (
        private readonly _CommandsRepository: Repository<CommandsOrmEntity>
    ) {}

    async loadCommand(command: string): Promise<string | null> {
        const responseCommand: CommandsOrmEntity | undefined = await this._CommandsRepository.findOne({command: command});
        if (responseCommand === undefined) return null;
        return responseCommand.commandMessage;
    }
}