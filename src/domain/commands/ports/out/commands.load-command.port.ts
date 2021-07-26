

export interface CommandsLoadCommandPort {
    loadCommand(command: string): Promise<string | null>
}