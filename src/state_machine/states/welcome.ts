import { State } from "../state";
import { StateId } from "./state_ids";
import { Message } from "whatsapp-web.js";
import { MessageResponse } from "../message_response";
import { JsonDB } from "../../db/json/json_db";
import { RegisterState } from "./register";
import { StateResponse } from "../state_response";

const EXPLAINATION_MESSAGE = `היי! אז מה זה שקמשלוחים?
מכירים את זה כשאתם במשרד ובא לכם משהו מהשקם אבל אין לכם כוח לצאת ממצוב בשביל זה?
עם שקמשלוחים אנשים שכבר נמצאים בשקם יוכלו לקחת הזמנה שלכם ולהביא אותה קרוב מספיק אליכם!
כל זה בציפייה שכשאתם תהיו שם אז תקחו מדי פעם למישהו שקית לבניין ;)`;

export class WelcomeState implements State {
    state_id = StateId.Welcome;
    supported_messages: string[] = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    
    onEnter(): MessageResponse {
        return null;
    }

    async handle(message: Message, user_id: string): Promise<StateResponse>{
        var response;
        await JsonDB.getInstance().getUser(user_id).then(user => {
            console.log("User: " + user);
            response = new StateResponse(this, new MessageResponse(`שלום ${user.name}`));
        }).catch(() => {
            console.log("User not found");
            response = new StateResponse(new RegisterState(), new MessageResponse(EXPLAINATION_MESSAGE));
        });
        console.log(response);
        return response;
    }
}
