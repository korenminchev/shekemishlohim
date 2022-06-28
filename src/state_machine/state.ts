import { Message } from "whatsapp-web.js";

interface State {
    state_id: number;
    supported_messages: string[];
    
    handle(message: Message) : State;
}

export { State };