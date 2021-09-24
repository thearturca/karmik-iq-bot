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

    addPasta(pasta: string, alias: string = "pasta"): void {
        this._pastaRepository.insert({pasta: pasta, alias: alias});
    }

    async updatePasta(pastaId: number, pasta: string): Promise<boolean> {
        const getPasta: PastaOrmEntity | undefined = await this._pastaRepository.findOne({id: pastaId});
        if (getPasta === undefined) return false
        getPasta.pasta = pasta;
        this._pastaRepository.save(getPasta)
        return true
    }
}