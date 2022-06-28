"use strict";
exports.__esModule = true;
exports.WelcomeState = void 0;
var state_ids_1 = require("./state_ids");
var WelcomeState = /** @class */ (function () {
    function WelcomeState() {
        this.state_id = state_ids_1.StateId.Welcome;
        this.supported_messages = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
    }
    WelcomeState.prototype.handle = function (message) {
        return { next_state: this, response: { sender_response: "Welcome to Shekemishlohim Bot!" } };
    };
    return WelcomeState;
}());
exports.WelcomeState = WelcomeState;
