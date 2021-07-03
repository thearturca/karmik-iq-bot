import { Repository } from "typeorm";
import { MessageGeneratorLoadMessagesPort } from "../../domain/string-generator/ports/out/message-generator.load-strings.port";
import { GeneratedMessageOrmEntity } from "./message-generator.generated-message.orm-entity";


export class MessageGeneratorPersistenceAdapter implements MessageGeneratorLoadMessagesPort {
    constructor (
        private readonly _messageGeneratorReository: Repository<GeneratedMessageOrmEntity>
    ) {}

    async loadMessages(type: string, subType: string): Promise<string[]> {
        const messages: GeneratedMessageOrmEntity[] = await this._messageGeneratorReository.find({type: type, subType: subType});
        let resMessages: string[] = [];

        messages.forEach((message) => {
            resMessages.push(message.message);
        })
        return resMessages;
    }
}