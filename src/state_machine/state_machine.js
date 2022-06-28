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
        var response = this.state.handle(message);
        this.chat.sendMessage(response.response);
        this.state = response.state;
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
