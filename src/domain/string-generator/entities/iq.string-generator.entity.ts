import { StringGeneratorEntity } from "./string-generator.entity";

export class IqStringGenerator implements StringGeneratorEntity {
    constructor(
        readonly _strings: string[] = []
    ) {}

    get strings(): string[] {
        return this._strings
    }

    generate(name: string): string {
        switch(name){
            default: 
            return "Iq string generator"
        }
        
    }
}