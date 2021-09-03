import { ChatUserstate, client as _client } from 'tmi.js-reply-fork';
import { ClientOnChatModule } from './modules/client/client.on-chat.module';
import { ClientResponseEntity, ClientResponseType } from './modules/client/client.response.entity';
import { CommandsPersistenceAdapter } from './modules/commands.persistence/commands.persistence.adapter';
import { CommandsPersistenceModule } from './modules/commands.persistence/commands.persistence.module';
import { GuardAdapter } from './modules/guard/guard.adapter';
import { GuardModule } from './modules/guard/guard.module';
import { IqUserPersistenceAdapter } from './modules/iq.user-persistence/iq.user-persistence.adapter';
import { IqUserPersistenceModule } from './modules/iq.user-persistence/iq.user-persistence.module';
import { MemesPersistenceAdapter } from './modules/memes.persistence/memes.persistence.adapter';
import { MemesPersistenceModule } from './modules/memes.persistence/memes.persistence.module';
import { MessageGeneratorPersistenceAdapter } from './modules/message-generator.persistence/message-generator-persistence.adapter';
import { MessageGeneratorPersistenceModule } from './modules/message-generator.persistence/message-generator-persistence.module';
import { PastaPersistenceAdapter } from './modules/pasta.persistence/pasta.persistence.adapter';
import { PastaPersistenceModule } from './modules/pasta.persistence/pasta.persistence.module';

export class app {
    public static async start(): Promise<void> {
        //guard and cooldown adapter
        const guard: GuardAdapter = new GuardModule();

        //set twitch tmi credentials
        const tmiUsername = process.env.TWITCH_USERNAME;
        const tmiSecret = process.env.TWITCH_OAUTH;

        //set twitch tmi target channel
        const target: string = process.env.TWITCH_TARGET_CHANNEL || tmiUsername;

        const client = new _client({
            options: {
              debug: false
            },
            connection: {
              reconnect: true
            },
            identity: {
                username: tmiUsername,
                password: tmiSecret
            },
            channels: [target]
        });

        console.log(`Connecting to ${target} twitch channel...`);
        await client.connect();
        console.log("Connected!");

        //connect to response message db
        const messageGeneratorPersistenceModule: MessageGeneratorPersistenceModule = new MessageGeneratorPersistenceModule();
        console.log("Connecting to message generator DB...");
        const messageGeneratorAdapter: MessageGeneratorPersistenceAdapter = await messageGeneratorPersistenceModule.connect();
        console.log("Connected!");

        //connect to iq db
        const iqPersistenceModule: IqUserPersistenceModule = new IqUserPersistenceModule();
        console.log("Connecting to iq DB...");
        const iqAdapter: IqUserPersistenceAdapter = await iqPersistenceModule.connect(target);
        console.log("Connected!");

        //connect to commands db
        const commandsPersistenceModule: CommandsPersistenceModule = new CommandsPersistenceModule();
        console.log("Connecting to commands DB...");
        const commandsAdapter: CommandsPersistenceAdapter = await commandsPersistenceModule.connect(target);
        console.log("Connected!");

        //connect to memes db
        const memesPersistenceModule: MemesPersistenceModule = new MemesPersistenceModule();
        console.log("Connecting to memes DB...");
        const memesAdapter: MemesPersistenceAdapter = await memesPersistenceModule.connect(target);
        console.log("Connected!");

        //connect to pasta db
        const  pastaPersistenceModule: PastaPersistenceModule = new PastaPersistenceModule();
        console.log("Connecting to pasta DB...");
        const pastaAdapter: PastaPersistenceAdapter = await pastaPersistenceModule.connect(target);
        console.log("Connected!");

        const adapters: {[k: string]: any} = {};
        adapters.iqAdapter = iqAdapter;
        adapters.messageGeneratorAdapter = messageGeneratorAdapter;
        adapters.commandsAdapter = commandsAdapter;
        adapters.pastaAdapter = pastaAdapter;
        adapters.memesAdapter = memesAdapter;

        client.on("notice", async (channel: string, message: string) => {
            console.log(message);
        })

        client.on("timeout", (channel: string, username: string, reason: string, duration: number) => {
            if(username === tmiUsername) {
                guard.startTimeout(duration);
            }
        })
        
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