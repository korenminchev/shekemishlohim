import { Chat, Message } from "whatsapp-web.js"
import { MessageHandler } from "./message_handler";

class ClientManager {
    clientMapping = {};
    
    handleClient(chat: Chat, lastClientMessage: Message) {        
        if (!this.clientMapping[chat.id._serialized]) {
            this.clientMapping[chat.id._serialized] = new MessageHandler(chat);
        }

        this.clientMapping[chat.id._serialized].handleMessage(lastClientMessage);
    }
}

export { ClientManager };