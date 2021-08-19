import { MemesGetMemeResponseEntity } from "../../entities/memes.get-meme.response-entity";
import { MemesGetMemeCommand } from "./memes.get-meme.command";


export interface MemesGetMemeUseCase {
    getMeme(command: MemesGetMemeCommand): Promise<MemesGetMemeResponseEntity>
}