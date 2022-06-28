import { Chat, Message } from "whatsapp-web.js";
import { MessageResponse } from "./message_response";
import { State } from "./state";
import { WelcomeState } from "./states/welcome";

export class StateMachine {
    chat : Chat;
    state: State;

    constructor(chat: Chat) {
        this.chat = chat;
        this.state = new WelcomeState();
    }

    handleMessage(message: Message): void {
        var state_result = this.state.handle(message);
        this.respond(state_result.response);
        this.state = state_result.next_state;
    }

    respond(response: MessageResponse) {
        this.chat.sendMessage(response.sender_response);
        if (!response.additional_receivers) {
            return;
        }

        response.additional_receivers.forEach(receiver => receiver.chat.sendMessage(receiver.response));
    }
}
