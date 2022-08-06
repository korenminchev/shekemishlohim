import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { MORE_INFO, RegisterState } from "./register";
import { StateResponse } from "../state_response";
import { DB } from "../../db/db";
import { OrderDeliveryState } from "./order_delivery";
import { botGenericInputError } from "../../models/bot_generic_messages";
import { BringDeliveryState } from "./bring_delivery";
import { destinationToHebrewString, floorToDestination } from "../../models/delivery_request";

const EXPLAINATION_MESSAGE = `היי! אז מה זה שקמשלוחים?
מכירים את זה כשאתם במשרד ובא לכם משהו מהשקם אבל אין לכם כוח לצאת ממצוב בשביל זה?
עם שקמשלוחים אנשים שכבר נמצאים בשקם יוכלו לקחת הזמנה שלכם ולהביא אותה קרוב מספיק אליכם!
כל זה בציפייה שכשאתם תהיו שם אז תקחו מדי פעם למישהו שקית לבניין ;)`;

const UNRECOGNIZED_COMMAND = botGenericInputError + ` אפשר לשלוח לי *עזרה* בשביל לראות את כל האוציותℹ️`

const botMessages = {
    unrecognized: botGenericInputError + `
בשקם? 🐝 שלח *ש*
באלך משלוח?🛵 שלח *מ*
אפשר לשלוח לי *עזרה* בשביל לראות את כל האופציותℹ️`,

    help: `*ג׳סטה* 😉 - הבוט למשלוחים מהשקם
בשקם?🐝 - *ש* או *בשקם* בשביל לקחת משלוח
יש לך דודא?🤤 - *מ* או *משלוח* בשביל להזמין משלוח

*טוקן* - כמות הטוקנים שברשותך 🪙
*פידבק* - להשארת פידבק, בעיות והצעות לשיפור השירות 📝
לעוד מידע ושאלות מוזמנים לכתוב לקורן - https://wa.me/972544917728`,

feedbackAccepted: `תודה על הפידבק!🙇 רשמתי לעצמי`
}



export class WelcomeState implements State {
    state_id = StateId.Welcome;
    supported_messages: string[] = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    db: DB;
    waitingForFeedback: boolean = false;

    constructor(db: DB) {
        this.db = db;
    }

    onEnter(): Promise<MessageResponse> {
        return null;
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        console.log(`Handling message in Welcome state: ${user_id} - ${message.body}`);
        var response;
        await this.db.getUser(user_id).then(user => {
            if (this.waitingForFeedback) {
                // TODO: handle feedback
                this.waitingForFeedback = false;
                response = new StateResponse(this, new MessageResponse(botMessages.feedbackAccepted));
                return;
            }
            
            // response = new StateResponse(this, new MessageResponse(`היי ${user.name} :)\n${MORE_INFO}`));
            switch (message.body) {
                case "בשקם":
                case "ש":
                    response = new StateResponse(new BringDeliveryState(this.db, user), new MessageResponse(`מציג בקשות ג׳סטה ל${destinationToHebrewString(floorToDestination(user.floor))}`));
                    break;

                case "משלוח":
                case "מ":
                    response = new StateResponse(new OrderDeliveryState(this.db, user_id), new MessageResponse(null));
                    break;

                case "עזרה":
                    response = new StateResponse(this, new MessageResponse(botMessages.help));
                    break;

                case "טוקן":
                    response = new StateResponse(this, new MessageResponse(`טוקנים שברשותך: ${user.token_count}🪙`));
                    break;

                case "פידבק":
                    this.waitingForFeedback = true;
                    response = new StateResponse(this, new MessageResponse(`היי ${user.name} אשמח לשמוע על החוויה שלך עם הבוט📝`));
                    break;

                default:
                    response = new StateResponse(this, new MessageResponse(botMessages.unrecognized));
            }
        }).catch(() => {
            this.db.increaseUniqueMessagesCount();
            console.log("Sending explanation message");
            response = new StateResponse(new RegisterState(this.db), new MessageResponse(EXPLAINATION_MESSAGE));
        });
        return response;
    }
}
