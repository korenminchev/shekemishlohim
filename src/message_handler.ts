import { Chat, Message } from "whatsapp-web.js";

class MessageHandler {
    chat: Chat;
    count: number;

    constructor(chat: Chat) {
        this.chat = chat;
        this.count = 0;
    }

    handleMessage(message: Message) {
        this.count++;
        this.chat.sendMessage("Your counter is " + this.count);
    }
}

export { MessageHandler };