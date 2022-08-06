import { Client } from 'whatsapp-web.js'

export class ChatFinder {

    static client: Client;

    static init(client: Client) {
        ChatFinder.client = client
    };

    static async findChat(chatId: string) {
        console.log(`Searching chat ${chatId}`);
        return await ChatFinder.client.getChatById(chatId + "@c.us")
    }
}