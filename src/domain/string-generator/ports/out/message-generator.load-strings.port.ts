

export interface MessageGeneratorLoadMessagesPort {
    loadMessages(type: string, subType: string): Promise<string[]>
}