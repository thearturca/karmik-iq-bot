import { randomG } from "../../IQ/entities/iq.utility";
import { MemesFactoryInterface } from "./memes.factory-interface";


export class MemesBigraccFactoryEntity implements MemesFactoryInterface {
    constructor () {}

    meme(): string {
        const rng = Math.floor(2 + randomG()*8);
        let bigraccStr = '';
        for (let i = 0; i < rng; i++){
            bigraccStr += "BIGRACC "
        }
        bigraccStr = bigraccStr.trim();
        return bigraccStr;
    }
}