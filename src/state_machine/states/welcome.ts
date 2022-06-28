import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";

class WelcomeState implements State {
    state_id = StateId.Welcome;
    supported_messages: string[] = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    

    handle(message: Message): {next_state: State, response: MessageResponse} {
        return {next_state: this, response: {sender_response: "Welcome to Shekemishlohim Bot!"}};
    }
}

export { WelcomeState };