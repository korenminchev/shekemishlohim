import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { User } from "../../models/user";
import { WelcomeState } from "./welcome";
import { StateResponse } from "../state_response";
import { DB } from "../../db/db";

enum RegisterStage {
    Begin,
    WaitingForName,
    WaitingForFloor,
}

var NAME_REQUEST = `אז בואו נתחיל, רק 2 פרטים קטנים!
איך קוראים לך?`;

var FLOOR_REQUEST = `?באיזה קומה את.ה
(1 - 6)
(ג) - גנסיס
(ס) - סמך
(ט) - טופז`

var INVALID_FLOOD = `סורי, לא הבנתי באיזה קומה את.ה :(\n` + FLOOR_REQUEST;

var THANKS_FOR_REGISTERING = `תודה על ההרשמה!\n
השירות עדיין לא פעיל אבל עובדים על זה קשה ונשלח הודעה ברגע שהכל יהיה מוכן!`
export class RegisterState implements State {
    state_id = StateId.Register;
    supported_messages = [];
    db: DB;
    stage: RegisterStage;
    phone_number: string;
    name: string;
    floor: number;

    constructor (db: DB) {
        this.db = db;
        this.stage = RegisterStage.Begin;
    }

    onEnter() : MessageResponse {
        this.stage = RegisterStage.WaitingForName;
        return {sender_response: NAME_REQUEST};
    }

    async handle(message: Message, user_id: string) : Promise<StateResponse> {
        switch (this.stage) {
        case RegisterStage.WaitingForName:
            this.phone_number = user_id;
            this.name = message.body;
            this.stage = RegisterStage.WaitingForFloor;
            return new StateResponse(this, new MessageResponse(FLOOR_REQUEST));

        case RegisterStage.WaitingForFloor:
            this.floor = parseInt(message.body);
            if (isNaN(this.floor) || this.floor > 6) {
                return new StateResponse(this, new MessageResponse(INVALID_FLOOD));
            }
            
            this.db.updateUser(new User(user_id, this.name, 2, this.floor));
            return new StateResponse(new WelcomeState(this.db), new MessageResponse(THANKS_FOR_REGISTERING));
        }
    }
}