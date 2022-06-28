import { Chat, Message } from "whatsapp-web.js"
import { StateMachine } from "./state_machine/state_machine";

const MILLISECONDS_IN_SECOND = 1000;
const MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;

class ClientManager {
    clientMapping : {[key: string]: StateMachine} = {};
    clientTimeouts : {[key: string]: NodeJS.Timeout} = {};
    
    handleClient(chat: Chat, lastClientMessage: Message) {
        // Disabling chat reset for now
        if (false) {
            // Remove the current timeout if it exists
            if (this.clientTimeouts[chat.id._serialized]) {
                clearTimeout(this.clientTimeouts[chat.id._serialized]);
            }
            // Remove the client message handler in 10 minutes
            this.clientTimeouts[chat.id._serialized] = 
                setTimeout(() => delete this.clientMapping[chat.id._serialized], 10 * MILLISECONDS_IN_MINUTE);
        }

        if (!this.clientMapping[chat.id._serialized]) {
            this.clientMapping[chat.id._serialized] = new StateMachine(chat);
        }

        this.clientMapping[chat.id._serialized].handleMessage(lastClientMessage);
    }
}

export { ClientManager };