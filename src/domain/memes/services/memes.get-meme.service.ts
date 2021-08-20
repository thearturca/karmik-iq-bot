import { MemesFactoryEntity, MemesTypes } from "../entities/memes.factory-entity";
import { MemesFactoryInterface } from "../entities/memes.factory-interface";
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
        const regularExp: RegExp = new RegExp(String.raw`(?:^|[^a-zA-Zа-яА-ЯёЁ])(?:` + triggers.join("|") + String.raw`)(?![a-zA-Zа-яА-ЯёЁ])`, "u");
        const foundedTrigger: RegExpMatchArray | null = command.message.match(regularExp);
        if (foundedTrigger === null) return new MemesGetMemeResponseEntity(false);
        const loadMemeTypeforTrigger: MemesTypes | null = await this._memesLoadMemesType.loadMemesType(foundedTrigger[0].trim());
        if (loadMemeTypeforTrigger === null) return new MemesGetMemeResponseEntity(false);
        const memeFactory: MemesFactoryInterface | null = MemesFactoryEntity.getMeme(loadMemeTypeforTrigger);
        if (memeFactory === null) return new MemesGetMemeResponseEntity(false);
        return new MemesGetMemeResponseEntity(true, loadMemeTypeforTrigger, memeFactory.meme(command.username));
    }
}