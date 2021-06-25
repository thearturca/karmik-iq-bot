import { StringGeneratorEntity } from "./string-generator.entity";

export class IqStringGenerator implements StringGeneratorEntity {
    constructor() {}

    generate(name: string): string {
        switch(name){
            default: 
            return "Iq string generator"
        }
        
    }
}