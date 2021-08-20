import { MemesBigraccFactoryEntity } from "./memes.bigracc.factory-entity";
import { MemesFactoryInterface } from "./memes.factory-interface";
import { MemesGachiFactoryEntity } from "./memes.gachi.factory-entity";
import { MemesPugplsFactoryEntity } from "./memes.pugpls.factory-entity";
import { MemesToiletFactoryEntity } from "./memes.toilet.factory-entity";

export enum MemesTypes {
    pugpls = "pugpls",
    gachi = "gachi",
    toilet = "toilet",
    bigracc= "bigracc"
}

export class MemesFactoryEntity {
    constructor() {}

    static getMeme(memeType:MemesTypes): MemesFactoryInterface | null {
        switch(memeType){
            case MemesTypes.pugpls:
                return new MemesPugplsFactoryEntity();
            case MemesTypes.gachi:
                return new MemesGachiFactoryEntity();
            case MemesTypes.toilet:
                return new MemesToiletFactoryEntity();
            case MemesTypes.bigracc:
                return new MemesBigraccFactoryEntity();
            default:
                return null;
        }
    }
}