import { randomG } from "../../IQ/entities/iq.utility";
import { MemesFactoryInterface } from "./memes.factory-interface";

const gachiEmotes: string[] = [
    "gachiJAM",
    "gachiGASM",
    "gachiHYPER",
    "gachiBASS"
];


export class MemesGachiFactoryEntity implements MemesFactoryInterface {
    constructor () {}

    meme(): string {
        const rng1 = Math.floor(randomG()*gachiEmotes.length);
        const rng2 = Math.floor(randomG()*4);
        let gachiStr = '';
        for (let i = 0; i < rng2; i++){
            gachiStr += gachiEmotes[rng1] + " ";
        }
        gachiStr = gachiStr.trim();
        return gachiStr;
    }
}