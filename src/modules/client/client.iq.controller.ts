import { ClientResponseEntity } from "./client.response.entity";


export class ClientIqController {
    static handle(user: any, message: String): ClientResponseEntity {

        const response = new ClientResponseEntity("reply", user, "test");
        return response;
    }
}