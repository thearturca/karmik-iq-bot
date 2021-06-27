

export interface StringGeneratorEntity {
    readonly _strings: string[];
    generate(name: string): string
}