

export interface CommandsGetCommandUseCase {
    getCommand(command: string): Promise<string>
}