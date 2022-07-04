import { MessageResponse } from "./message_response";
import { State } from "./state";

export class StateResponse {
    next_state: State;
    response: MessageResponse;

    constructor(next_state: State, response: MessageResponse) {
        this.next_state = next_state;
        this.response = response;
    }
}