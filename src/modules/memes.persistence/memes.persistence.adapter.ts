import { Repository } from "typeorm";
import { MemesTriggersOrmEntity } from "./memes.orm-entity";


export class MemesPersistenceAdapter implements  {
    constructor (
        private readonly _MemesTriggersRepository: Repository<MemesTriggersOrmEntity>
    ) {}

}