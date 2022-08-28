import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { RegisterState } from "./register";
import { StateResponse } from "../state_response";
import { DB } from "../../db/db";
import { OrderDeliveryState } from "./order_delivery";
import { botGenericInputError } from "../../models/bot_generic_messages";
import { BringDeliveryState } from "./bring_delivery";
import { destinationToHebrewString, floorToDestination } from "../../models/delivery_request";
import { Backend } from "../../backend/backend";
import { UserStatus } from "../../models/user";

const UNRECOGNIZED_COMMAND = botGenericInputError + ` אפשר לשלוח לי *עזרה* בשביל לראות את כל האוציותℹ️`

const botMessages = {

    explenationMessage: `היי! אז מה זה *ג׳סטה*?
מכירים את זה כשאתם במשרד ובא לכם משהו מהשקם🤤 אבל אין לכם כוח לצאת ממצוב בשביל זה?
עם *ג׳סטה*, חברים(ג׳סטרים) שכבר נמצאים בשקם יוכלו לקחת הזמנה שלכם ולהביא אותה קרוב מספיק אליכם!
כל זה בציפייה שכשאתם תהיו שם אז תעשו ג׳סטה מדי פעם😉`,

nameRequest: `אז בואו נתחיל, רק 2 פרטים קטנים!
איך קוראים לך?`,

unregisteredJester: `היי, צריך להרשם לפני שיהיה אפשר לעשות ג׳סטה😊
*הרשמה* - להרשמות לג׳סטה📝
*עזרה* - לכל הפעולותℹ️`,

unregisteredDelivery: `היי, צריך להרשם לפני שיהיה אפשר לבקש ג׳סטה😊
*הרשמה* - להרשמות לג׳סטה📝
*עזרה* - לכל הפעולותℹ️`,

    unrecognized: botGenericInputError + `

בשקם? 🐝 שלח *ש*
באלך משלוח?🛵 שלח *מ*
אפשר לשלוח לי *עזרה* בשביל לראות את כל האופציותℹ️`,

unregisteredUnrecognized: botGenericInputError + `

*הרשמה* - הרשמות לג׳סטה📝
*עזרה* - לכל הפעולות`,

    help: `*ג׳סטה* 😉 - הבוט למשלוחים מהשקם

בשקם?🐝 - *ש*, *שקם* או *אני בשקם* בשביל לקחת משלוח
יש לך דודא?🤤 - *מ* או *משלוח* בשביל להזמין משלוח

*טוקן* - כמות הטוקנים שברשותך 🪙
*פידבק* - להשארת פידבק, בעיות והצעות לשיפור השירות 📝
*סטטוס* - בדיקת סטטוס ההזמנה שלך 📋
*ביטול* - ביטול ההזמנה שלך 🔙
*מידע* - מידע נוסף על הקונספט של ג׳סטה
לעוד מידע ושאלות מוזמנים לכתוב לקורן - https://wa.me/972544917728`,

unregisteredHelp: `*ג׳סטה* 😉 - הבוט למשלוחים מהשקם
*פידבק* - להשארת פידבק, בעיות והצעות לשיפור השירות 📝
*מידע* - מידע נוסף על הקונספט של ג׳סטהℹ️
*הרשמה* - הרשמות לג׳סטה
לעוד מידע ושאלות מוזמנים לכתוב לקורן - https://wa.me/972544917728`,

    feedbackAccepted: `תודה על הפידבק!🙇 רשמתי לעצמי`,
    noActiveDelivery: `היי😄 אין לך כרגע משלוח שמחכה לאיסוף. להזמנת משלוח אפשר לשלוח *מ* או *משלוח*`,
    orderWaitingForDelivery: `ההזמנה שלך מחכה שמישהו יקח אותה מהשקם🛵
לביטול ההזמנה - *ביטול*`,
    orderCancelled: `ההזמנה בוטלה בהצלחה👍
אשמח לפירוט אם לא היית מרוצה ממשהו📝 - ניתן להשאיר פידבק אחרי שליחת *פידבק*`,

    orderCancelledFailure: `סורי, היית שגיאה בביטול ההזמנה שלך🤕
כבר בודק את זה💪`,

    orderIsOnTheWay: `המשלוח בדרך מהשקם🛵`,

    noTokens: `סורי, אין לך כרגע טוקנים בשביל להזמין משלוח😞
ניתן להשיג טוקנים ע״י ג׳סטה מהשקם לחבר😉`,

    haveAnActiveOrder: `היי, מזכיר שיש לך הזמנה פעילה שמחכה לאיסוף🛵
אם היא כבר לא רלוונטית תוכל לבטל אותה אחר כך😃`,
    youCanCancelOrder: `אפשר לבטל את ההזמנה על ידי שליחת *ביטול*`,
    workingOnIt: `עובדים על דברים אחרונים לפני שהכל יהיה מוכן ויהיה אפשר להזמין משלוח😄`,
    workingOnItJester: `עובדים על דברים אחרונים לפני שהכל יהיה מוכן ויהיה אפשר לעשות ג׳סטה😄`,
    info: `ברוכים הבאים *לג׳סטה*! 🥳
אז איך הכל עובד:
להזמנת משלוח, פשוט שולחים *מ* או *משלוח*, עוקבים אחרי הצעדים ומחכים שמישהו יעשה ג׳סטה😌

כאשר המשלוח יגיע תקבלו תמונה מדויקת של איפה הוא נמצא ואת פרטי הקשר של הג׳סטר שלכם כדי להעביר לו את הסכום של ההזמנה שלכם בדרך שנוח לשניכם👨🏼‍🤝‍👨🏽

בשביל לעשות ג׳סטה 🛵:
• שולחים ש, שקם או אני בשקם
• בוחרים משלוח שרוצים לעשות ושמים את הקבלה בשקית✅
• מביאים אותו לעמדת המשלוחים המתאימה ביחידה (לובי מצוב או חמל טופז, לפי המיקום שלכם)📦
•מצלמים תמונה של המשלוח בעמדה📸
• ישלחו אליכם פרטי הקשר של המזמין כדי שתוכלו להסדיר ביניכם את התשלום💸

הזמנות ומשלוחים נעימים💛`
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
        if (this.waitingForFeedback) {
            this.db.saveFeedback(user_id, message.body.slice(0, 512));
            this.waitingForFeedback = false;
            response = new StateResponse(this, new MessageResponse(botMessages.feedbackAccepted));
            return response;
        }

        await this.db.getUser(user_id).then(async user => {
            switch (message.body) {
                case "שקם":
                case "אני בשקם":
                case "ש":
                    var additional_data = [];
                    var status: UserStatus = await (Backend.getUserStatus(user_id));
                    if (status != null && status != UserStatus.no_delivery) {
                        additional_data = [{
                            chat: user_id,
                            response: botMessages.haveAnActiveOrder + botMessages.youCanCancelOrder
                        }]
                    }
                    response = new StateResponse(new BringDeliveryState(this.db, user), new MessageResponse(`מציג בקשות ג׳סטה ל${destinationToHebrewString(floorToDestination(user.floor))}`, additional_data));
                    break;

                case "משלוח":
                case "מ":
                    if (user.token_count <= 0) {
                        response = new StateResponse(this, new MessageResponse(botMessages.noTokens));
                        break;
                    }

                    var status: UserStatus = await (Backend.getUserStatus(user_id));
                    if (status != UserStatus.no_delivery) {
                        response = new StateResponse(this, new MessageResponse(botMessages.orderWaitingForDelivery));
                        break;
                    }
                    response = new StateResponse(new OrderDeliveryState(this.db, user_id), new MessageResponse(null));
                    break;

                case "עזרה":
                    response = new StateResponse(this, new MessageResponse(botMessages.help));
                    break;

                case "טוקן":
                case "תוקן":
                    response = new StateResponse(this, new MessageResponse(`טוקנים שברשותך: ${user.token_count}🪙`));
                    break;

                case "פידבק":
                    this.waitingForFeedback = true;
                    response = new StateResponse(this, new MessageResponse(`היי ${user.name} אשמח לשמוע על החוויה שלך עם הבוט📝`));
                    break;

                case "סטטוס":
                    var status: UserStatus = await (Backend.getUserStatus(user_id));
                    switch (status) {
                        case null:
                        case UserStatus.no_delivery:
                            response = new StateResponse(this, new MessageResponse(botMessages.noActiveDelivery));
                            break;

                        case UserStatus.not_assigned_delivery:
                            response = new StateResponse(this, new MessageResponse(botMessages.orderWaitingForDelivery))
                            break;

                        case UserStatus.assigned_delivery:
                            response = new StateResponse(this, new MessageResponse(botMessages.orderIsOnTheWay));
                            break;
                    }

                    break;

                case "ביטול":
                    var status: UserStatus = await (Backend.getUserStatus(user_id));
                    if (status == null || status == UserStatus.no_delivery) {
                        response = new StateResponse(this, new MessageResponse(botMessages.noActiveDelivery));
                        break;
                    }

                    await Backend.closeDelivery(user.phone_number).then((success: boolean) => {
                        if (success) {
                            user.token_count += 1;
                            this.db.updateUser(user);
                            response = new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.orderCancelled));
                            return;
                        }
                        else {
                            response = new StateResponse(this, new MessageResponse(botMessages.orderCancelledFailure));
                            return;
                        }
                    });
                    break;

                case "מידע":
                    response = new StateResponse(this, new MessageResponse(botMessages.info));
                    break;

                default:
                    response = new StateResponse(this, new MessageResponse(botMessages.unrecognized));
            }
        }).catch(() => {
            this.db.increaseUniqueMessagesCount();
            switch (message.body) {
                case "היי, מה זה ג׳סטה?":
                    response = new StateResponse(new RegisterState(this.db), new MessageResponse(botMessages.explenationMessage, [{chat: user_id, response: botMessages.nameRequest}]));
                    break;

                case "שקם":
                case "אני בשקם":
                case "ש":
                    response = new StateResponse(this, new MessageResponse(botMessages. unregisteredJester));
                    break;

                case "משלוח":
                case "מ":
                    response = new StateResponse(this, new MessageResponse(botMessages.unregisteredDelivery));
                    break;

                case "מידע":
                    response = new StateResponse(this, new MessageResponse(botMessages.info));
                    break;
                
                case "עזרה":
                    response = new StateResponse(this, new MessageResponse(botMessages.unregisteredHelp));
                    break;
                
                case "הרשמה":
                    response = new StateResponse(new RegisterState(this.db), new MessageResponse(botMessages.nameRequest));
                    break;

                case "פידבק":
                    this.waitingForFeedback = true;
                    response = new StateResponse(this, new MessageResponse(`היי, אשמח לשמוע על החוויה שלך עם הבוט📝`));
                    break;

                default:
                    response = new StateResponse(this, new MessageResponse(botMessages.unregisteredUnrecognized));
                    break;
            }
        });
        return response;
    }
}
