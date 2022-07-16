import { Chat, Message, Contact } from "whatsapp-web.js";
import { DB } from "../db/db";
import { MessageResponse } from "./message_response";
import { State } from "./state";
import { WelcomeState } from "./states/welcome";

export class StateMachine {
    chat: Chat;
    phone_number: string;
    state: State;
    db: DB;

    constructor(chat: Chat, db: DB) {
        this.chat = chat;
        this.db = db;
        this.chat.getContact().then((contact: Contact) => {
            this.phone_number = contact.number;
        });
        this.state = new WelcomeState(db);
    }

    async handleMessage(message: Message): Promise<void> {
        var state_result = await this.state.handle(message, this.phone_number);
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
