import { Message } from "whatsapp-web.js";
import { Backend } from "../../backend/backend";
import { DB } from "../../db/db";
import { botGenericInputError } from "../../models/bot_generic_messages";
import { DeliveryRequest, Destination, Expiration, floorToDestination } from "../../models/delivery_request";
import { User } from "../../models/user";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";
import { WelcomeState } from "./welcome";

enum OrderDeliveryStage {
    Duration,
    Contents,
}

const userInputs = {
    Today: "יום",
    Week: "שבוע",
    Month: "חודש",
    Cancel: "ביטול"
};

const botMessages = {
deliveryTime: `לכמה זמן הבקשה שלך תהיה רלוונטית?⏳
*יום*
*שבוע*
*חודש*`,

contents: `מה באלך מהשקם?🛍️`,
orderSuccess: `ההזמנה נשלחה בהצלחה✅
ניתן לשלוח *סטטוס* בשביל לבדוק את מצב ההזמנה📋`,

orderFailure: `סורי, היית שגיאה בקבלת ההזמנה שלך🤕
אני בודק את זה🔍, בינתיים אפשר לנסות שוב`,
}

export class OrderDeliveryState implements State {

    state_id: number;
    supported_messages: string[];
    user_id: string;
    db: DB;
    delivery_request: DeliveryRequest;
    order_stage: OrderDeliveryStage;
    deliveryId: number;
    user: User;

    constructor(db: DB, user_id: string) {
        this.db = db;
        this.user_id = user_id;
        this.delivery_request = new DeliveryRequest(parseInt(this.user_id));
    }

    async onEnter(): Promise<MessageResponse> {
        // TODO: Check if the user has enough tokens to start the order
        this.delivery_request.destination = Destination.building;
        this.db.getUser(this.user_id).then((user: User) => {
            this.delivery_request.destination = floorToDestination(user.floor);
            this.user = user;
        });
        this.order_stage = OrderDeliveryStage.Duration;
        return new MessageResponse(botMessages.deliveryTime);
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.order_stage) {
            case OrderDeliveryStage.Duration:
                switch (message.body) {
                    case userInputs.Today:
                        this.delivery_request.expiration = Expiration.day;
                        break;

                    case userInputs.Week:
                        this.delivery_request.expiration = Expiration.week;
                        break;

                    case userInputs.Month:
                        this.delivery_request.expiration = Expiration.month;
                        break;

                    default:
                        return new StateResponse(this, new MessageResponse(botGenericInputError + "\n" + botMessages.deliveryTime));
                }

                this.order_stage = OrderDeliveryStage.Contents;
                return new StateResponse(this, new MessageResponse(botMessages.contents));

            case OrderDeliveryStage.Contents:
                this.delivery_request.content = message.body
                return Backend.createDelivery(this.delivery_request).then((deliveryId: number) => {
                    if (deliveryId != -1) {
                        this.deliveryId = deliveryId
                        this.user.token_count -= 1;
                        this.user.delivery_id = deliveryId;
                        this.db.updateUser(this.user);
                        return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.orderSuccess));
                    }
                    return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.orderFailure));
                }).catch(error => {
                    return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.orderFailure));
                });

            default:
                break;
        }

        return new StateResponse(this, new MessageResponse("התחלת ההזמנה"));
    }
}
