import { Message } from "whatsapp-web.js";
import { Backend } from "../../backend/backend";
import { DB } from "../../db/db";
import { DeliveryRequest, Destination, Expiration } from "../../models/delivery_request";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";

enum OrderDeliveryStage {
    Duration,
    Contents,
    PickedUp,
    Delivered
}

export class OrderDeliveryState implements State {

    state_id: number;
    supported_messages: string[];
    user_id: string;
    db: DB;
    delivery_request: DeliveryRequest;
    order_stage: OrderDeliveryStage;
    order_duration: Expiration;

    constructor(db: DB, user_id: string) {
        this.db = db;
        this.user_id = user_id;
        this.delivery_request = new DeliveryRequest(parseInt(this.user_id));
    }

    onEnter(): MessageResponse {
        // TODO: Check if the user has enough tokens to start the order
        // TODO: Update the destination field using the user's location
        this.delivery_request.destination = Destination.building;

        this.order_stage = OrderDeliveryStage.Duration;
        return new MessageResponse("מתי תרצה לקבל את ההזמנה");
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.order_stage) {
            case OrderDeliveryStage.Duration:
                switch (message.body) {
                    case "היום":
                        this.delivery_request.expiration = Expiration.day;
                        break;

                    case "השבוע":
                        this.delivery_request.expiration = Expiration.week;
                        break;

                    case "החודש":
                        this.delivery_request.expiration = Expiration.month;
                        break;

                    default:
                        return new StateResponse(this, new MessageResponse("לא הבנתי למתי אתה רוצה את המשלוח"));
                }

                this.order_stage = OrderDeliveryStage.Contents;
                return new StateResponse(this, new MessageResponse("מה אתה רוצה מהשקם?"));

            case OrderDeliveryStage.Contents:
                this.delivery_request.content = message.body
                return Backend.createDelivery(this.delivery_request).then((success: boolean) => {
                    if (success) {
                        this.order_stage = OrderDeliveryStage.PickedUp;
                        return new StateResponse(this, new MessageResponse("ההזמנה נשלחה בהצלחה"));
                    }
                    return new StateResponse(this, new MessageResponse("אירעה שגיאה בעת שליחת ההזמנה"));
                }).catch(error => {
                    return new StateResponse(this, new MessageResponse("אירעה שגיאה בעת שליחת ההזמנה"));
                });


            case OrderDeliveryStage.PickedUp:
                break;

            case OrderDeliveryStage.Delivered:
                break;

            default:
                break;
        }

        return new StateResponse(this, new MessageResponse("התחלת ההזמנה"));
    }
}
