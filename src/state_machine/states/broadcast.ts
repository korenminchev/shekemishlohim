import { Message } from "whatsapp-web.js";
import { DB } from "../../db/db";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";
import { WelcomeState } from "./welcome";

enum BroadcastStage {
    validation,
    broadcast    
}


export class BroadcastState implements State {

    botMessages = {
        requestValidation: `הקלד את הקוד הסודי`,
        sendBroadcast: `שלח את הודעת השידור`
    }


    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    state_id: number;
    supported_messages: string[];
    db: DB;
    validationCode: string;
    stage: BroadcastStage;

    constructor(db: DB) {
        this.db = db;
    }

    async onEnter(): Promise<MessageResponse> {
        this.validationCode = this.getRandomInt(100000, 999999).toString();
        this.stage = BroadcastStage.validation;
        return new MessageResponse(this.botMessages.requestValidation, [{ chat: "972544917728", response: this.validationCode }])
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.stage) {
        case BroadcastStage.validation:
            if (message.body == this.validationCode) {
                this.stage = BroadcastStage.broadcast;
                return new StateResponse(this, new MessageResponse(this.botMessages.sendBroadcast));
            }
            return new StateResponse(new WelcomeState(this.db), new MessageResponse("שגיאה", [{chat: "972544917728", response: `${user_id} ניסה לשלוח הודעת שידור`}]))

        case BroadcastStage.broadcast:
            // Send to all
            return new StateResponse(new WelcomeState(this.db), new MessageResponse("משדר:\n" + message.body))
        }
    }
}

