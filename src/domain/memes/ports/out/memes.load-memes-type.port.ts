import { MemesTypes } from "../../entities/memes.factory-entity";


export interface MemesLoadMemesTypePort {
    loadMemesType(trigger: string): Promise<MemesTypes | null>
}