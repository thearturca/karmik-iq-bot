import { client as _client } from 'tmi.js-reply-fork';
import { ClientOnChatModule } from './modules/client/client.on-chat.module';
import { ClientResponseEntity } from './modules/client/client.response.entity';
import { IqUserPersistenceModuel } from './modules/iq.user-persistence/iq.user-persistence.module';

export class app {
    public static async start(): Promise<void> {
        const persistenceModule: IqUserPersistenceModuel = new IqUserPersistenceModuel();
        const iqAdapter = await persistenceModule.connect();

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

        await client.connect();
        client.on("chat", async (channel: String, user: any, message: string, self: boolean) => {
            if (self) return

            const response: ClientResponseEntity = await ClientOnChatModule.handle(user, message, adapters);
            switch(response.type){
                case 'none':
                    await client.say(target, response.message)
                    return
                break;

                case 'reply':
                    await client.reply(target, response.message, response.user)
                    return
                break;

                case 'say':
                    await client.say(target, response.message)
                    return
                break;
            }
        })
    }
}