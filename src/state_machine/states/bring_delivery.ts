import { Message, MessageContent } from "whatsapp-web.js";
import { DB, RecordNotFound } from "../../db/db";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";
import { WelcomeState } from "./welcome";
import { User } from "../../models/user";
import { DeliveryRequest, destinationToHebrewString, floorToDestination } from "../../models/delivery_request";
import { Backend } from "../../backend/backend";
import { botGenericInputError } from "../../models/bot_generic_messages";

const userInputs = {
    confirm: "אישור",
    next: "הבא",
    cancel: "ביטול"
}

const botMessages = {
    noDeliveries: `אין משלוחים כרגע😅
תודה על הג׳סטה בכל זאת🙇`,

    deliveryPickedUp: `תודה על הג׳סטה🙇
רק נשאר להשאיר את השקית בעמדת המשלוחים ולצלם תמונה📸
*לא לשכוח לשים קבלה בשקית*😉`,

    recipientPickedup: `היי! המשלוח שלך נאסף🛵🥳
כאשר הוא יגיע תשלח אליך תמונה כדי שיהיה לך נוח לאסוף אותו!`,

    notImage: `אני לא חושב שזאת תמונה😅
בשביל לסיים את הג׳סטה אני צריך רק תמונה של השקית בעמדת המשלוחים📸`,

    thankYou: `תודה רבה רבה על הג׳סטה!🙇
הנה הפרטים של המזמין בשביל שתסדרו ביניכם את התשלום💰:
`,

    receiverArrived: `המשלוח שלך הגיע!🥳
עכשיו רק נשאר לסדר את התשלום מול הג׳סטר שלך💵:
`,

    payementTipRecepeient: `*טיפ:* ניתן להעביר כסף בביט גם כאשר איש הקשר לא שמור, ע״י הזנת מספר הטלפון במקום האיש קשר`,
    payementTipJester: `*טיפ:* ניתן לבקש כסף בביט גם כאשר איש הקשר לא שמור, ע״י הזנת מספר הטלפון במקום האיש קשר`,

    sadLeave: `חבל לי שביטלת את הג׳סטה😞
אפשר לתת לי פידבק בשליחת *פידבק*, אשמח לשמוע📝
תודה בכל זאת🙇`,
}

enum PickupState {
    Choosing,
    Delivering,
}

function formatDelivery(delivery: DeliveryRequest): string {
    return `${delivery.content}

*אישור* - לאישור הג׳סטה🛵
*הבא* - לקבלת בקשה אחרת⏭️
*ביטול* - לביטול הג׳סטה❌`;
}

export class BringDeliveryState implements State {
    db: DB;
    state_id: number;
    supported_messages: string[];
    pickupState: PickupState;
    user: User;
    deliveries: DeliveryRequest[];
    deliveryIndex: number = 0;

    constructor(db: DB, user: User) {
        this.db = db;
        this.user = user;
    }

    async onEnter(): Promise<MessageResponse> {
        const destination = floorToDestination(this.user.floor);
        return Backend.getDeliveries(destination, this.user.phone_number).then((deliveries) => {
            this.deliveries = deliveries
            if (this.deliveries == null || this.deliveries.length == 0) {
                return new MessageResponse(botMessages.noDeliveries, null, false);
            }
            this.pickupState = PickupState.Choosing;
            return new MessageResponse(formatDelivery(this.deliveries[this.deliveryIndex]));
        });
    }

    async handle(message: Message): Promise<StateResponse> {
        switch (this.pickupState) {
            case PickupState.Choosing:
                return this.handleChoosing(message);

            case PickupState.Delivering:
                if (!message.hasMedia) {
                    return new StateResponse(this, new MessageResponse(botMessages.notImage));
                }

                var receiver: User = await this.db.getUser(this.deliveries[this.deliveryIndex].receiver_id.toString());
                const image = await message.downloadMedia();
                this.user.token_count++;
                this.db.updateUser(this.user);
                Backend.closeDelivery(receiver.phone_number);
                return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.thankYou + receiver.name.split(" ")[0] + " - " + receiver.phone_number + '\n' + botMessages.payementTipJester, [
                    { chat: receiver.phone_number, response: image },
                    { chat: receiver.phone_number, response: botMessages.receiverArrived + this.user.name.split(" ")[0] + " - " + this.user.phone_number + "\n" + botMessages.payementTipRecepeient }
                ]
                ));
        }
    }

    async handleChoosing(nessage: Message): Promise<StateResponse> {
        switch (nessage.body) {
            case userInputs.confirm:    
                var success: boolean = await Backend.acceptDelivery(this.deliveries[this.deliveryIndex].receiver_id, this.user.phone_number);
                if (!success) {
                    return new StateResponse(this, new MessageResponse(botMessages.sadLeave));
                }
                this.pickupState = PickupState.Delivering;
                return new StateResponse(this, new MessageResponse(botMessages.deliveryPickedUp, [{ chat: this.deliveries[this.deliveryIndex].receiver_id.toString(), response: botMessages.recipientPickedup }]));

            case userInputs.next:
                this.deliveryIndex++;
                if (this.deliveryIndex >= this.deliveries.length) {
                    this.deliveryIndex = 0;
                }
                return new StateResponse(this, new MessageResponse(formatDelivery(this.deliveries[this.deliveryIndex])));

            case userInputs.cancel:
                return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.sadLeave));

            default:
                return new StateResponse(this, new MessageResponse(botGenericInputError + "\nהג׳סטה שביקשו" + formatDelivery(this.deliveries[this.deliveryIndex])));
        }
    }
}