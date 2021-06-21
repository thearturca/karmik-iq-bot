import { client as _client } from 'tmi.js-reply-fork';
import { ClientOnChatModule } from './modules/client/client.on-chat.module';
import { ClientResponseEntity } from './modules/client/client.response.entity';
import { IqUserPersistenceModuel } from './modules/iq.user-persistence/iq.user-persistence.module';

export class app {
    public static async start(): Promise<void> {
        const persistenceModule: IqUserPersistenceModuel = new IqUserPersistenceModuel();

        console.log("Connecting to iq DB...");
        const iqAdapter = await persistenceModule.connect();
        console.log("Connected!");

        const adapters: {[k: string]: any} = {};
        adapters.iqAdapter = iqAdapter;

        const target = "thearturca"
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
        client.on("chat", async (channel: String, user: any, message: string, self: boolean) => {
            if (self) return

            const response: ClientResponseEntity = await ClientOnChatModule.handle(user, message, adapters);
            switch(response.type){
                case 'none':
                   // await client.say(target, response.message)
                    return
                break;

                case 'reply':
                    await client.reply(target, response.message, response.user)
                    console.log("Date: ", new Date());
                    console.log("Message: \n", message);
                    console.log("response: \n", response);
                    return
                break;

                case 'say':
                    await client.say(target, response.message)
                    console.log("Date: ", new Date());
                    console.log("Message: \n", message);
                    console.log("response: \n", response);
                    return
                break;
            }
        })
        console.log("Waiting for messages...");
    }
}