import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { MORE_INFO, RegisterState } from "./register";
import { StateResponse } from "../state_response";
import { DB } from "../../db/db";
import { OrderDeliveryState } from "./order_delivery";

const EXPLAINATION_MESSAGE = `היי! אז מה זה שקמשלוחים?
מכירים את זה כשאתם במשרד ובא לכם משהו מהשקם אבל אין לכם כוח לצאת ממצוב בשביל זה?
עם שקמשלוחים אנשים שכבר נמצאים בשקם יוכלו לקחת הזמנה שלכם ולהביא אותה קרוב מספיק אליכם!
כל זה בציפייה שכשאתם תהיו שם אז תקחו מדי פעם למישהו שקית לבניין ;)`;

const UNRECOGNIZED_COMMAND = `סורי, לא הבנתי😅 אפשר לשלוח לי "עזרה" בשביל לראות את כל האוציותℹ️`

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
        console.log(`Handling message in Welcome state: ${user_id} - ${message.body}`);
        var response;
        await this.db.getUser(user_id).then(user => {
            // response = new StateResponse(this, new MessageResponse(`היי ${user.name} :)\n${MORE_INFO}`));
            switch (message.body) {
                case "בשקם":
                case "ש":
                    response = new StateResponse(this, new MessageResponse("עדיין לא פיתחתי את הצד של השקם"));
                    break;

                case "משלוח":
                case "מ":
                    response = new StateResponse(new OrderDeliveryState(this.db), new MessageResponse(null));
                    break;

                case "עזרה":
                    response = new StateResponse(this, new MessageResponse("תפריט עזרה"));
                    break;

                default:
                    response = new StateResponse(this, new MessageResponse(UNRECOGNIZED_COMMAND));
            }
        }).catch(() => {
            this.db.increaseUniqueMessagesCount();
            console.log("Sending explanation message");
            response = new StateResponse(new RegisterState(this.db), new MessageResponse(EXPLAINATION_MESSAGE));
        });
        return response;
    }
}
