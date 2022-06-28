import { Message } from "whatsapp-web.js";
import { MessageResponse } from "./message_response";

export interface State {
    state_id: number;
    supported_messages: string[];

    handle(message: Message) : {next_state: State, response: MessageResponse};
}
