import { Chat, Message } from "whatsapp-web.js";
import { State } from "./state";
import { WelcomeState } from "./states/welcome";

class StateMachine {
    chat : Chat;
    state: State;

    constructor(chat: Chat) {
        this.chat = chat;
        this.state = new WelcomeState();
    }

    handleMessage(message: Message): void {
        var response = this.state.handle(message);
        this.chat.sendMessage(response.response);
        this.state = response.state;
    }
}

export { StateMachine };