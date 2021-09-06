import { PastaGetPastaResponseEntity } from "../entities/pasta.get-pasta.response-entity";
import { PastaGetPastaUseCase } from "../ports/in/pasta.get-pasta.use-case";
import { PastaGetPastaCommand } from "../ports/in/pasta.get-pasta.command";
import { PastaLoadPastaPort } from "../ports/out/pasta.load-pasta.port";

export class PastaGetPastaService implements PastaGetPastaUseCase{
    constructor(
        private readonly _pastaLoadPastaPort: PastaLoadPastaPort
    ) {}

    async getPasta(command: PastaGetPastaCommand): Promise<PastaGetPastaResponseEntity> {
        const getPastaMessage: string[] | null = await this._pastaLoadPastaPort.loadPasta(command.pastaName);
        if (getPastaMessage === null) return new PastaGetPastaResponseEntity(false, command.pastaName);
        const pastaNumber: number = Number(command.pastaName);
        if (pastaNumber !== NaN && pastaNumber-1 <= getPastaMessage.length) {
            return new PastaGetPastaResponseEntity(true,  command.pastaName, pastaNumber , getPastaMessage[pastaNumber-1]);
        }
        const random: number = Math.floor(Math.random() * (getPastaMessage.length));
        return new PastaGetPastaResponseEntity(true,  command.pastaName, random+1, getPastaMessage[random]);
    }
}