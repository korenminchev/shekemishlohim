import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { MORE_INFO, RegisterState } from "./register";
import { StateResponse } from "../state_response";
import { DB } from "../../db/db";

const EXPLAINATION_MESSAGE = `היי! אז מה זה שקמשלוחים?
מכירים את זה כשאתם במשרד ובא לכם משהו מהשקם אבל אין לכם כוח לצאת ממצוב בשביל זה?
עם שקמשלוחים אנשים שכבר נמצאים בשקם יוכלו לקחת הזמנה שלכם ולהביא אותה קרוב מספיק אליכם!
כל זה בציפייה שכשאתם תהיו שם אז תקחו מדי פעם למישהו שקית לבניין ;)`;

export class WelcomeState implements State {
    state_id = StateId.Welcome;
    supported_messages: string[] = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    db: DB;

    constructor(db: DB) {
        this.db = db;
    }

    onEnter(): MessageResponse {
        return null;
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        var response;
        await this.db.getUser(user_id).then(user => {
            response = new StateResponse(this, new MessageResponse(`היי ${user.name} :)\n${MORE_INFO}`));
        }).catch(() => {
            response = new StateResponse(new RegisterState(this.db), new MessageResponse(EXPLAINATION_MESSAGE));
        });
        return response;
    }
}
