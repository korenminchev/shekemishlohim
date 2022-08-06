import { Chat, Message, Contact } from "whatsapp-web.js";
import { ChatFinder } from "../bot_tools/chat_finder";
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
        await this.respond(state_result.response);

        if (state_result.next_state == this.state) {
            return;
        }

        var response = await state_result.next_state.onEnter();
        if (response != null) {
            this.respond(response);

            if (response.enter_state) {
                this.state = state_result.next_state;
            }
            return;
        }

        this.state = state_result.next_state;        
    }

    async respond(response: MessageResponse) {
        if (response.sender_response != null) {
            this.chat.sendMessage(response.sender_response);
        }
        if (!response.additional_receivers) {
            return;
        }
        console.log(response.additional_receivers);

        response.additional_receivers.forEach(async receiver => await ChatFinder.findChat(receiver.chat).then(async (chat) => await chat.sendMessage(receiver.response)));
    }
}
