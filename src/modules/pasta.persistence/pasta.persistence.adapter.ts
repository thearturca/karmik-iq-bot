import { Repository } from "typeorm";
import { PastaLoadPastaPort } from "../../domain/pasta/ports/out/pasta.load-pasta.port";
import { PastaOrmEntity } from "./pasta.orm-entity";


export class PastaPersistenceAdapter implements PastaLoadPastaPort {
    constructor (
        private readonly _pastaRepository: Repository<PastaOrmEntity>
    ) {}

    async loadPasta(command: string): Promise<string[] | null> {
        const responsePasta: PastaOrmEntity[] = await this._pastaRepository.find();
        const res: string[] = responsePasta.map((val) => {
            return val.pasta
        });
        return res;
    }
}