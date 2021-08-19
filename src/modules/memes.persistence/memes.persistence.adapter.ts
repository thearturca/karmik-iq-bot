import { resolve } from "path/posix";
import { Repository } from "typeorm";
import { MemesTypes } from "../../domain/memes/entities/memes.factory-entity";
import { MemesLoadMemesTypePort } from "../../domain/memes/ports/out/memes.load-memes-type.port";
import { MemesLoadTriggersPort } from "../../domain/memes/ports/out/memes.load-triggers.port";
import { MemesOrmEntity } from "./memes.orm-entity";
import { MemesTriggersOrmEntity } from "./memes.triggers.orm-entity";



export class MemesPersistenceAdapter implements MemesLoadTriggersPort, MemesLoadMemesTypePort{
    constructor (
        private readonly _memesTriggersRepository: Repository<MemesTriggersOrmEntity>,
        private readonly _memesRepository: Repository<MemesOrmEntity>
    ) {}

    async loadTriggers(): Promise<string[]> {
        const resOrmEntity: MemesTriggersOrmEntity[] = await this._memesTriggersRepository.find();
        let res: string[] = [];
        resOrmEntity.forEach((v) => {
            res.push(v.memeTrigger);
        })
        return res;
    }

    async loadMemesType(trigger: string): Promise<MemesTypes | null> {
        const resOrmEntity: MemesOrmEntity | undefined = await this._memesRepository.findOne({memeTrigger: {memeTrigger: trigger}});
        if (resOrmEntity === undefined) return null;
        const res: MemesTypes = MemesTypes[resOrmEntity.meme]
        return res;
    }
}