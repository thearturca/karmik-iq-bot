

export interface PastaLoadPastaPort {
    loadPasta(command: string): Promise<string[] | null>;
    addPasta(pasta: string, alias: string): void;
}