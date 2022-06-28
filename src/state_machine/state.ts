import { Message } from "whatsapp-web.js";
import { MessageResponse } from "./message_response";

interface State {
    state_id: number;
    supported_messages: string[];

    handle(message: Message) : {state: State, response: MessageResponse};
}

export { State };