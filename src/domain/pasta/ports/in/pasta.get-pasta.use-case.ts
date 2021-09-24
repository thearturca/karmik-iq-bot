import { PastaGetPastaResponseEntity } from "../../entities/pasta.get-pasta.response-entity";
import { PastaGetPastaCommand } from "./pasta.get-pasta.command";
import { UpdatePastaCommand } from "./pasta.update-pasta.command";


export interface PastaGetPastaUseCase {
    getPasta(command: PastaGetPastaCommand): Promise<PastaGetPastaResponseEntity>;
    updatePasta(command: UpdatePastaCommand): void;
}