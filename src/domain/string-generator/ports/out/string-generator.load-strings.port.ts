

export interface StringGeneratorLoadStringsPort {
    loadStrings(type: string): Promise<string[]>
}