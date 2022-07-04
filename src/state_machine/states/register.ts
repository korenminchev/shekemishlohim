import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { JsonDB } from "../../db/json/json_db";
import { User } from "../../models/user";
import { WelcomeState } from "./welcome";
import { StateResponse } from "../state_response";

enum RegisterStage {
    Begin,
    WaitingForName,
    WaitingForFloor,
}

export class RegisterState implements State {
    state_id = StateId.Register;
    supported_messages = [];
    stage: RegisterStage;
    phone_number: string;
    name: string;
    floor: number;

    constructor () {
        this.stage = RegisterStage.Begin;
    }

    onEnter() : MessageResponse {
        this.stage = RegisterStage.WaitingForName;
        return {sender_response: "What's your name?"};
    }

    async handle(message: Message, user_id: string) : Promise<StateResponse> {
        switch (this.stage) {
        case RegisterStage.WaitingForName:
            this.phone_number = user_id;
            this.name = message.body;
            this.stage = RegisterStage.WaitingForFloor;
            return new StateResponse(this, new MessageResponse("What floor are you from?"));

        case RegisterStage.WaitingForFloor:
            this.floor = parseInt(message.body);
            if (isNaN(this.floor) || this.floor > 6) {
                return new StateResponse(this, new MessageResponse("Invalid floor number. What floor are you from?"));
            }
            
            JsonDB.getInstance().updateUser(new User(user_id, this.name, 2, this.floor));
            return new StateResponse(new WelcomeState(), new MessageResponse("Thanks for registering!"));
        }
    }
}