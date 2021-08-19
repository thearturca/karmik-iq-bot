import { MemesGetMemeResponseEntity } from "../entities/memes.get-meme.response-entity";
import { MemesGetMemeCommand } from "../ports/in/memes.get-meme.command";
import { MemesGetMemeUseCase } from "../ports/in/memes.get-meme.use-case";
import { MemesLoadMemesTypePort } from "../ports/out/memes.load-memes-type.port";
import { MemesLoadTriggersPort } from "../ports/out/memes.load-triggers.port";


export class MemesGetMemeService implements MemesGetMemeUseCase{
    constructor(
        private readonly _memesLoadtriggers: MemesLoadTriggersPort,
        private readonly _memesLoadMemesType: MemesLoadMemesTypePort
    ) {}

    async getMeme(command: MemesGetMemeCommand): Promise<MemesGetMemeResponseEntity> {
        const triggers: string[] = await this._memesLoadtriggers.loadTriggers();
        
    }
}