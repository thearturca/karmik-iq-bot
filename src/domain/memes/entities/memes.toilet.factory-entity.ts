import { MemesFactoryInterface } from "./memes.factory-interface";

const toilet = ['это толчок', 'это дристалище', 'это сортир', 'это тубзак', 'это белый трон', 'это сральня', 'это уборная', 'это очко', 'это клозет', 'это гальюн', 'это нужник', 'это толкан', 'это туалет типа сортир', 'это разгрузочная', 'это параша', 'это санузел', 'это уголок задумчивости', 'это биде', 'это тайная команата'];

const varToilet = ['толчок', 'дристалище', 'сортир', 'тубзак', 'белый трон', 'сральня', 'уборная', 'очко', 'клозет', 'гальюн', 'нужник', 'толкан', 'туалет типа сортир', 'разгрузочная', 'параша', 'санузел', 'уголок задумчивости', 'биде', 'тайная команата'];

export class MemesToiletFactoryEntity implements MemesFactoryInterface {
    constructor() {}

    meme(username: string): string {
        const rngPhrase = Math.floor(Math.random()*(toilet.length-1));
        const res: string = `${username} — ${toilet[rngPhrase]}. Без негатива karmikSmile SantaHat`;
        return res
    }
}