

export interface PastaLoadPastaPort {
    loadPasta(command: string): Promise<string[] | null>
}