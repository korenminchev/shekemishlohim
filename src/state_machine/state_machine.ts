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
        this.state = this.state.handle(message);
    }
}

export { StateMachine };