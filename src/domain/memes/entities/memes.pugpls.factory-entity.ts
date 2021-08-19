import { randomG } from "../../IQ/entities/iq.utility";
import { MemesFactoryInterface } from "./memes.factory-interface";


export class MemesPugplsFactoryEntity implements MemesFactoryInterface {
    constructor () {}

    meme(): string {
        const rng = Math.floor(randomG()*4);
        let pugplsStr = '';
        for (let i = 0; i < rng; i++){
            pugplsStr += "pugPls "
        }
        pugplsStr = pugplsStr.trim();
        return pugplsStr;
    }
}