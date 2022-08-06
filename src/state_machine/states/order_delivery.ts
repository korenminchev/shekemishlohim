import { Message } from "whatsapp-web.js";
import { DB } from "../../db/db";
import { Expiration } from "../../models/delivery_request";
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
    db: DB;
    order_stage: OrderDeliveryStage;
    order_duration: Expiration;

    constructor(db: DB) {
        this.db = db;
    }

    onEnter(): MessageResponse {
        // TODO: Check if the user has enough tokens to start the order
        this.order_stage = OrderDeliveryStage.Duration;
        return new MessageResponse("מתי תרצה לקבל את ההזמנה");
    }
    
    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.order_stage) {
            case OrderDeliveryStage.Duration:
                switch (message.body) {
                    case "היום":
                        this.order_duration = Expiration.day;
                        break;

                    case "השבוע":
                        this.order_duration = Expiration.week;
                        break;
                        
                    case "החודש":
                        this.order_duration = Expiration.month;
                        break;

                    default:
                        return new StateResponse(this, new MessageResponse("לא הבנתי למתי אתה רוצה את המשלוח"));
                }

                this.order_stage = OrderDeliveryStage.Contents;
                return new StateResponse(this, new MessageResponse("מה אתה רוצה מהשקם?"));

            case OrderDeliveryStage.Contents:
                break;

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
