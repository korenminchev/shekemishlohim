"use strict";
exports.__esModule = true;
exports.ClientManager = void 0;
var message_handler_1 = require("./message_handler");
var ClientManager = /** @class */ (function () {
    function ClientManager() {
        this.clientMapping = {};
    }
    ClientManager.prototype.handleClient = function (chat, lastClientMessage) {
        if (!this.clientMapping[chat.id._serialized]) {
            this.clientMapping[chat.id._serialized] = new message_handler_1.MessageHandler(chat);
        }
        this.clientMapping[chat.id._serialized].handleMessage(lastClientMessage);
    };
    return ClientManager;
}());
exports.ClientManager = ClientManager;
