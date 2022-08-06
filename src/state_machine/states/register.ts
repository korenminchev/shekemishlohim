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

var INVALID_FLOOR = `סורי, לא הבנתי באיזה קומה את.ה :(\n` + FLOOR_REQUEST;

var THANKS_FOR_REGISTERING = `תודה על ההרשמה!`

export var MORE_INFO = `השירות עדיין לא פעיל אבל עובדים על זה קשה ונשלח הודעה ברגע שהכל יהיה מוכן!\n
לעוד מידע ושאלות מוזמנים לכתוב לקורן - https://wa.me/972544917728`

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

    async onEnter() : Promise<MessageResponse> {
        console.log("Entering Register state");
        this.stage = RegisterStage.WaitingForName;
        return new MessageResponse(NAME_REQUEST);
    }

    async handle(message: Message, user_id: string) : Promise<StateResponse> {
        console.log(`Handling message in Register state(${this.stage}): ${user_id} - ${message.body}`);
        switch (this.stage) {
        case RegisterStage.WaitingForName:
            this.phone_number = user_id;
            this.name = message.body;
            this.stage = RegisterStage.WaitingForFloor;
            console.log("Handled name");
            return new StateResponse(this, new MessageResponse(FLOOR_REQUEST));
            
        case RegisterStage.WaitingForFloor:
            var floor: any = parseInt(message.body);
            if (isNaN(floor)) {
                switch (message.body) {
                case "ג":
                    floor = 'g';
                    break;
                case "ס":
                    floor = 's';
                    break;
                case "ט":
                    floor = 't';
                    break;
                default:
                    console.log(`Invalid floor`);
                    return new StateResponse(this, new MessageResponse(INVALID_FLOOR));
                }
            }
            else {
                if (floor < 1 || floor > 6) {
                    console.log(`Invalid floor`);
                    return new StateResponse(this, new MessageResponse(INVALID_FLOOR));
                }
            }
            this.db.createUser(new User(user_id, this.name, 2, floor));
            console.log(`User ${user_id} registered with name ${this.name} and floor ${floor}`);
            return new StateResponse(new WelcomeState(this.db), new MessageResponse(THANKS_FOR_REGISTERING + "\n" + MORE_INFO));
        }
    }
}