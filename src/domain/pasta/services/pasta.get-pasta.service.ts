import { PastaGetPastaResponseEntity } from "../entities/pasta.get-pasta.response-entity";
import { PastaGetPastaUseCase } from "../ports/in/pasta.get-pasta.use-case";
import { PastaGetPastaCommand } from "../ports/in/pasta.get-pasta.command";
import { PastaLoadPastaPort } from "../ports/out/pasta.load-pasta.port";
import { AddPastaCommand } from "../ports/in/pasta.add-pasta.command";
import { UpdatePastaCommand } from "../ports/in/pasta.update-pasta.command";

export class PastaGetPastaService implements PastaGetPastaUseCase{
    constructor(
        private readonly _pastaLoadPastaPort: PastaLoadPastaPort
    ) {}

    async getPasta(command: PastaGetPastaCommand): Promise<PastaGetPastaResponseEntity> {
        const getPastaMessage: string[] | null = await this._pastaLoadPastaPort.loadPasta(command.pastaName);
        if (getPastaMessage === null) return new PastaGetPastaResponseEntity(false, command.pastaName);

        const pastaNumber: number = Number(command.pastaName)-1;
        if (pastaNumber !== NaN && pastaNumber > 0 && pastaNumber < getPastaMessage.length) {
            return new PastaGetPastaResponseEntity(true,  command.pastaName, pastaNumber+1 , getPastaMessage[pastaNumber]);
        }
        
        const random: number = Math.floor(Math.random() * (getPastaMessage.length));
        return new PastaGetPastaResponseEntity(true, command.pastaName, random+1, getPastaMessage[random]);
    }

    addPasta(command: AddPastaCommand): void {
        this._pastaLoadPastaPort.addPasta(command.pasta, command.alias);
    }
    
    async updatePasta(command: UpdatePastaCommand): Promise<void> {
        const res = await this._pastaLoadPastaPort.updatePasta(command.pastaId, command.pasta);
        
    }
}