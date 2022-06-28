import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";

class WelcomeState implements State {
    state_id = StateId.Welcome;
    supported_messages: string[] = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    

    handle(message: Message): State {
        return this;
    }
}

export { WelcomeState };