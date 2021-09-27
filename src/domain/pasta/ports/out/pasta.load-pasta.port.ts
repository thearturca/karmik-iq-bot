

export interface PastaLoadPastaPort {
    loadPasta(): Promise<string[] | null>;
    loadPastaById(pastaId: number): Promise<string | null>;
    addPasta(pasta: string, alias: string): void;
    updatePasta(pastaId: number, pasta: string): Promise<boolean>;
}