import { Message } from "whatsapp-web.js";
import { Backend } from "../../backend/backend";
import { DB } from "../../db/db";
import { botGenericInputError } from "../../models/bot_generic_messages";
import { DeliveryRequest, Destination, Source, floorToDestination, Expiration } from "../../models/delivery_request";
import { User } from "../../models/user";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";
import { WelcomeState } from "./welcome";

enum OrderDeliveryStage {
    Location,
    Contents,
}

const userInputs = {
    Lotem: "לוטם",
    Shakmaz: "שקמז",
    Cancel: "ביטול"
};

const botMessages = {
    deliveryDestination: `מאיפה להביא את הג׳סטה?📍
*לוטם*
*שקמז*
*ביטול*❌`,

    contents: `מה באלך מהשקם?🛍️

*ביטול* - לביטול ההזמנה`,
    orderSuccess: `ההזמנה נשלחה בהצלחה✅
ניתן לשלוח *סטטוס* בשביל לבדוק את מצב ההזמנה📋`,

    orderFailure: `סורי, היית שגיאה בקבלת ההזמנה שלך🤕
אני בודק את זה🔍, בינתיים אפשר לנסות שוב`,

    sadLeave: `חבל לי שביטלת את המשלוח😞
אפשר לתת לי פידבק בשליחת *פידבק*, אשמח לשמוע📝`,
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
        this.delivery_request = new DeliveryRequest(this.user_id);
    }

    async onEnter(): Promise<MessageResponse> {
        this.delivery_request.destination = Destination.building;
        this.db.getUser(this.user_id).then((user: User) => {
            this.delivery_request.destination = floorToDestination(user.floor);
            this.user = user;
        });
        this.order_stage = OrderDeliveryStage.Location;
        return new MessageResponse(botMessages.deliveryDestination);
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.order_stage) {
            case OrderDeliveryStage.Location:
                switch (message.body) {
                    case userInputs.Lotem:
                        this.delivery_request.source = Source.lotem;
                        break;

                    case userInputs.Shakmaz:
                        this.delivery_request.source = Source.shakmaz;
                        break;

                    case userInputs.Cancel:
                        new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.sadLeave));
                        break;

                    default:
                        return new StateResponse(this, new MessageResponse(botGenericInputError + "\n" + botMessages.deliveryDestination));
                }

                this.order_stage = OrderDeliveryStage.Contents;
                return new StateResponse(this, new MessageResponse(botMessages.contents));

            case OrderDeliveryStage.Contents:
                if (message.body == userInputs.Cancel) {
                    return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.sadLeave));
                }
                this.delivery_request.content = message.body
                this.delivery_request.expiration = Expiration.month;
                return Backend.createDelivery(this.delivery_request).then((success: boolean) => {
                    if (success) {
                        this.user.token_count -= 1;
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
