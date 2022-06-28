"use strict";
exports.__esModule = true;
exports.StateMachine = void 0;
var welcome_1 = require("./states/welcome");
var StateMachine = /** @class */ (function () {
    function StateMachine(chat) {
        this.chat = chat;
        this.state = new welcome_1.WelcomeState();
    }
    StateMachine.prototype.handleMessage = function (message) {
        var state_result = this.state.handle(message);
        this.respond(state_result.response);
        this.state = state_result.next_state;
    };
    StateMachine.prototype.respond = function (response) {
        this.chat.sendMessage(response.sender_response);
        if (!response.additional_receivers) {
            return;
        }
        response.additional_receivers.forEach(function (receiver) { return receiver.chat.sendMessage(receiver.response); });
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
