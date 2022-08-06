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
import { Backend } from "../../backend/backend";

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
*סטטוס* - בדיקת סטטוס ההזמנה שלך 📋
*ביטול* - ביטול ההזמנה שלך 🔙
לעוד מידע ושאלות מוזמנים לכתוב לקורן - https://wa.me/972544917728`,

    feedbackAccepted: `תודה על הפידבק!🙇 רשמתי לעצמי`,
    noActiveDelivery: `היי😄 אין לך כרגע משלוח שמחכה לאיסוף. להזמנת משלוח אפשר לשלוח *מ* או *משלוח*`,
    orderWaitingForDelivery: `ההזמנה שלך מחכה שמישהו יקח אותה מהשקם🛵
לביטול ההזמנה - *ביטול*`,
    orderCancelled: `ההזמנה בוטלה בהצלחה👍
אשמח לפירוט אם לא היית מרוצה ממשהו📝 - ניתן להשאיר פידבק אחרי שליחת *פידבק*`,

    orderCancelledFailure: `סורי, היית שגיאה בביטול ההזמנה שלך🤕
כבר בודק את זה💪`,

haveAnActiveOrder: `היי, מזכיר שיש לך הזמנה פעילה שמחכה לאיסוף🛵:`,
youCanCancelOrder: `אפשר לבטל את ההזמנה על ידי שליחת *ביטול*`,
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
        await this.db.getUser(user_id).then(async user => {
            if (this.waitingForFeedback) {
                // TODO: handle feedback
                this.waitingForFeedback = false;
                response = new StateResponse(this, new MessageResponse(botMessages.feedbackAccepted));
                return;
            }
            console.log(user.delivery_id)
            console.log(user.hasDelivery())

            switch (message.body) {
                case "בשקם":
                case "ש":
                    var additional_data;
                    if (user.hasDelivery()) {
                        additional_data = [{
                            chat: user_id,
                            response: botMessages.haveAnActiveOrder + botMessages.youCanCancelOrder
                        }]
                    }
                    response = new StateResponse(new BringDeliveryState(this.db, user), new MessageResponse(`מציג בקשות ג׳סטה ל${destinationToHebrewString(floorToDestination(user.floor))}`, additional_data));
                    break;

                case "משלוח":
                case "מ":
                    if (user.hasDelivery()) {
                        response = new StateResponse(this, new MessageResponse(botMessages.orderWaitingForDelivery));
                        break;
                    }
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

                case "סטטוס":
                    if (!user.hasDelivery()) {
                        response = new StateResponse(this, new MessageResponse(botMessages.noActiveDelivery));
                        break;
                    }

                    // TODO: get delivery status
                    response = new StateResponse(this, new MessageResponse(botMessages.orderWaitingForDelivery))
                    break;

                case "ביטול":
                    if (!user.hasDelivery()) {
                        response = new StateResponse(this, new MessageResponse(botMessages.noActiveDelivery));
                    }

                    await Backend.closeDelivery(user.delivery_id).then((success: boolean) => {
                        if (success) {
                            user.token_count += 1;
                            user.delivery_id = null;
                            this.db.updateUser(user);
                            response = new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.orderCancelled));
                            return;
                        }
                        else {
                            response = new StateResponse(this, new MessageResponse(botMessages.orderCancelledFailure));
                            return;
                        }
                    });

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
