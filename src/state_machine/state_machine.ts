import { Chat, Message } from "whatsapp-web.js";
import { DB } from "../db/db";
import { MessageResponse } from "./message_response";
import { State } from "./state";
import { WelcomeState } from "./states/welcome";

export class StateMachine {
    chat : Chat;
    state: State;
    db: DB;

    constructor(chat: Chat, db: DB) {
        this.chat = chat;
        this.db = db;
        this.state = new WelcomeState(db);
    }

    async handleMessage(message: Message): Promise<void> {
        console.log("Handling message: " + message.body);
        var state_result = await this.state.handle(message, this.chat.id._serialized);
        console.log("State result: " + state_result);
        this.respond(state_result.response);

        if (state_result.next_state == this.state) {
            return;
        }

        this.state = state_result.next_state;
        var response = this.state.onEnter();
        if (response != null) {
            this.respond(response);
        }
    }

    respond(response: MessageResponse) {
        this.chat.sendMessage(response.sender_response);
        if (!response.additional_receivers) {
            return;
        }

        response.additional_receivers.forEach(receiver => receiver.chat.sendMessage(receiver.response));
    }
}
