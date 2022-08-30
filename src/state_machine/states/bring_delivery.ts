import { Message, MessageContent } from "whatsapp-web.js";
import { DB, RecordNotFound } from "../../db/db";
import { MessageResponse } from "../message_response";
import { State } from "../state";
import { StateResponse } from "../state_response";
import { WelcomeState } from "./welcome";
import { User } from "../../models/user";
import { DeliveryRequest, destinationToHebrewString, floorToDestination, Source } from "../../models/delivery_request";
import { Backend } from "../../backend/backend";
import { botGenericInputError } from "../../models/bot_generic_messages";

const userInputs = {
    lotem: "לוטם",
    shakmaz: "שקמז",
    confirm: "אישור",
    next: "הבא",
    cancel: "ביטול",
    missing: "אין בשקם"
}

const botMessages = {
    noDeliveries: `אין משלוחים כרגע😅
תודה על הג׳סטה בכל זאת🙇`,

    deliveryPickedUp: `רק נשאר להשאיר את השקית בעמדת המשלוחים ולצלם תמונה📸
*לא לשכוח לשים קבלה בשקית*😉`,

    recipientPickedup: `היי! המשלוח שלך נאסף🛵🥳
כאשר הוא יגיע תשלח אליך תמונה כדי שיהיה לך נוח לאסוף אותו!`,

    notNumber: `זה לא נראה לי כמו מספר😅`,

    noted: `רשמתי לעצמי🗒️`,

    priceRequest: `תודה רבה על הג׳סטה😍
כמה עלה לך המשלוח?`,

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

    source: `באיזה שקם אתה😃
*לוטם*
*שקמז*

*ביטול*❌ - לביטול הג׳סטה`,

    sadLeave: `חבל לי שביטלת את הג׳סטה😞
אפשר לתת לי פידבק בשליחת *פידבק*, אשמח לשמוע📝
תודה בכל זאת🙇`,

    criticalError: `הייתה לי תקלה קריטית🤧
סליחה, כבר בודק את זה🔍`
}

enum PickupState {
    Location,
    Choosing,
    Price,
    Delivering,
}


export class BringDeliveryState implements State {
    db: DB;
    state_id: number;
    supported_messages: string[];
    pickupState: PickupState;
    user: User;
    deliveries: DeliveryRequest[];
    deliveryIndex: number = 0;
    deliverySource: Source;
    deliveryPrice: number;

    constructor(db: DB, user: User) {
        this.db = db;
        this.user = user;
    }

    async formatDelivery(delivery: DeliveryRequest): Promise<string> {
        var receiver: User = await this.db.getUser(delivery.receiver_id)


        return `משלוח ל${receiver.firstName} מ${receiver.floorAsString}
        להודעה - wa.me/${receiver.phone_number}
        
        ${delivery.content}
    
*אישור* - לאישור הג׳סטה🛵
*הבא* - לקבלת בקשה אחרת⏭️
*ביטול* - לביטול הג׳סטה❌`;
    }

    async onEnter(): Promise<MessageResponse> {
        this.pickupState = PickupState.Location;
        return new MessageResponse(botMessages.source);
    }

    async handle(message: Message, user_id: string): Promise<StateResponse> {
        switch (this.pickupState) {
            case PickupState.Location:
                switch (message.body) {
                    case userInputs.lotem:
                        this.deliverySource = Source.lotem;
                        break;

                    case userInputs.shakmaz:
                        this.deliverySource = Source.shakmaz;
                        break;

                    case userInputs.cancel:
                        return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.sadLeave));

                    default:
                        return new StateResponse(this, new MessageResponse(botGenericInputError + "\n" + botMessages.source));
                }

                const destination = floorToDestination(this.user.floor);
                return Backend.getDeliveries(this.user.phone_number, destination, this.deliverySource).then(async (deliveries) => {
                    this.deliveries = deliveries;
                    if (this.deliveries == null || this.deliveries.length == 0) {
                        return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.noDeliveries));
                    }
                    this.pickupState = PickupState.Choosing;
                    return new StateResponse(this, new MessageResponse(await this.formatDelivery(this.deliveries[this.deliveryIndex])));
                });

            case PickupState.Choosing:
                return this.handleChoosing(message);

            case PickupState.Price:
                switch (message.body) {
                    case userInputs.missing:
                        this.deliveryIndex++;
                        this.pickupState = PickupState.Choosing;
                        return new StateResponse(this, new MessageResponse(botMessages.noted, [{ chat: user_id, response: await this.formatDelivery(this.deliveries[this.deliveryIndex]) }]))

                    default:
                        var price = parseFloat(message.body)
                        console.log(price);
                        if (price == NaN) {
                            return new StateResponse(this, new MessageResponse(botMessages.notNumber));
                        }

                        this.deliveryPrice = price;
                        this.pickupState = PickupState.Delivering;
                        return new StateResponse(this, new MessageResponse(botMessages.deliveryPickedUp));
                }

            case PickupState.Delivering:
                if (!message.hasMedia) {
                    return new StateResponse(this, new MessageResponse(botMessages.notImage));
                }

                var receiver: User = await this.db.getUser(this.deliveries[this.deliveryIndex].receiver_id.toString());
                const image = await message.downloadMedia();
                this.user.token_count++;
                this.db.updateUser(this.user);
                Backend.closeDelivery(receiver.phone_number);
                return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.thankYou
                    + receiver.name.split(" ")[0] + " - " + receiver.phone_number.replace(RegExp("^972"), "0")
                    + `\nלהודעה - wa.me/${receiver.phone_number}`
                    + '\n' + botMessages.payementTipJester,
                    [
                        { chat: receiver.phone_number, response: image },
                        {
                            chat: receiver.phone_number, response: botMessages.receiverArrived
                                + this.user.name.split(" ")[0] + " - "
                                + this.user.phone_number.replace(RegExp("^972"), "0")
                                + `\nלהודעה - wa.me/${this.user.phone_number}`
                                + `\nעליך להעביר ${this.deliveryPrice} לג׳סטר שלך`
                                + "\n" + botMessages.payementTipRecepeient
                        }
                    ]
                ));

            default:
                return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.criticalError));
        }
    }

    async handleChoosing(nessage: Message): Promise<StateResponse> {
        switch (nessage.body) {
            case userInputs.confirm:
                var success: boolean = await Backend.acceptDelivery(this.deliveries[this.deliveryIndex].receiver_id, this.user.phone_number);
                if (!success) {
                    return new StateResponse(this, new MessageResponse(botMessages.sadLeave));
                }
                this.pickupState = PickupState.Price;
                return new StateResponse(this, new MessageResponse(botMessages.priceRequest, [{ chat: this.deliveries[this.deliveryIndex].receiver_id.toString(), response: botMessages.recipientPickedup }]));

            case userInputs.next:
                this.deliveryIndex++;
                if (this.deliveryIndex >= this.deliveries.length) {
                    this.deliveryIndex = 0;
                }
                return new StateResponse(this, new MessageResponse(await this.formatDelivery(this.deliveries[this.deliveryIndex])));

            case userInputs.cancel:
                return new StateResponse(new WelcomeState(this.db), new MessageResponse(botMessages.sadLeave));

            default:
                return new StateResponse(this, new MessageResponse(botGenericInputError + "\nהג׳סטה שביקשו" + await this.formatDelivery(this.deliveries[this.deliveryIndex])));
        }
    }
}