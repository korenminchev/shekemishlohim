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
רק נשאר להשאיר את השקית בעמדת המשלוחים ולצלם תמונה📸`,

    recipientMessage: `היי! המשלוח שלך נאסף🛵🥳
כאשר הוא יגיע תשלח אליך תמונה כדי שיהיה לך נוח לאסוף אותו!`,

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
        return Backend.getDeliveries(destination).then((deliveries) => {
            this.deliveries = deliveries
            if (this.deliveries == null || this.deliveries.length == 0) {
                return new MessageResponse(botMessages.noDeliveries, null, false);
            }
            this.pickupState = PickupState.Choosing;
            return new MessageResponse(formatDelivery(this.deliveries[this.deliveryIndex]));
        });
    }

    async handle(nessage: Message, user_id: string): Promise<StateResponse> {
        switch (this.pickupState) {
            case PickupState.Choosing:
                return this.handleChoosing(nessage);

        }
    }

    async handleChoosing(nessage: Message): Promise<StateResponse> {
        switch (nessage.body) {
            case userInputs.confirm:
                this.pickupState = PickupState.Delivering;
                return new StateResponse(this, new MessageResponse(botMessages.deliveryPickedUp, [{ chat: this.deliveries[this.deliveryIndex].receiver_id.toString(), response: botMessages.recipientMessage }]));

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