import { ChatUserstate, client as _client } from 'tmi.js-reply-fork';
import { ClientOnChatModule } from './modules/client/client.on-chat.module';
import { ClientResponseEntity, ClientResponseType } from './modules/client/client.response.entity';
import { GuardAdapter } from './modules/guard/guard.adapter';
import { GuardModule } from './modules/guard/guard.module';
import { IqUserPersistenceAdapter } from './modules/iq.user-persistence/iq.user-persistence.adapter';
import { IqUserPersistenceModuel } from './modules/iq.user-persistence/iq.user-persistence.module';
import { MessageGeneratorPersistenceAdapter } from './modules/message-generator.persistence/message-generator-persistence.adapter';
import { MessageGeneratorPersistenceModule } from './modules/message-generator.persistence/message-generator-persistence.module';

export class app {
    public static async start(): Promise<void> {
        //guard and cooldown adapter
        const guard: GuardAdapter = new GuardModule();

        //set target twitch channel
        const target = "karmikkoala"

        //connect to response message db
        const messageGeneratorPersistenceModule: MessageGeneratorPersistenceModule = new MessageGeneratorPersistenceModule();
        console.log("Connecting to message generator DB...");
        const messageGeneratorAdapter: MessageGeneratorPersistenceAdapter = await messageGeneratorPersistenceModule.connect();
        console.log("Connected!");

        //connect to iq db
        const iqPersistenceModule: IqUserPersistenceModuel = new IqUserPersistenceModuel();
        console.log("Connecting to iq DB...");
        const iqAdapter: IqUserPersistenceAdapter = await iqPersistenceModule.connect(target);
        console.log("Connected!");

        const adapters: {[k: string]: any} = {};
        adapters.iqAdapter = iqAdapter;
        adapters.messageGeneratorAdapter = messageGeneratorAdapter;

        const client = new _client({
            options: {
              debug: false
            },
            connection: {
              reconnect: true
            },
            identity: {
                username: "thearturca",
                password: "oauth:grn7crnga7ia39u9jdvweio2wc21t2"
            },
            channels: [target]
        });

        console.log(`Connecting to ${target} twitch channel...`);
        await client.connect();
        console.log("Connected!");
        
        client.on("chat", async (channel: string, user: ChatUserstate, message: string, self: boolean) => {
            if (self) return
            if (!guard.maySendResponse()) return

            const response: ClientResponseEntity = await ClientOnChatModule.handle(user, message, adapters);
            switch(response.type){
                case ClientResponseType.none:
                    //await client.say(channel, response.message)
                    return
                break;

                case ClientResponseType.reply:
                    await client.reply(channel, response.message, response.user || user);
                    guard.updateCooldownTime();
                    console.log("Date: ", new Date());
                    console.log("Message: \n", message);
                    console.log("Response: \n", response);
                    return
                break;

                case ClientResponseType.say:
                    await client.say(channel, response.message);
                    guard.updateCooldownTime();
                    console.log("Date: ", new Date());
                    console.log("Message: \n", message);
                    console.log("Response: \n", response);
                    return
                break;
            }
        })
        console.log("Waiting for messages...");
    }
}