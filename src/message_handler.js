"use strict";
exports.__esModule = true;
exports.MessageHandler = void 0;
var MessageHandler = /** @class */ (function () {
    function MessageHandler(chat) {
        this.chat = chat;
        this.count = 0;
    }
    MessageHandler.prototype.handleMessage = function (message) {
        this.count++;
        this.chat.sendMessage("Your counter is " + this.count);
    };
    return MessageHandler;
}());
exports.MessageHandler = MessageHandler;
