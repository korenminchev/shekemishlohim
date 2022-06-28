"use strict";
exports.__esModule = true;
exports.MessageResponse = void 0;
var MessageResponse = /** @class */ (function () {
    function MessageResponse(message, additional_receivers) {
        this.sender_response = message;
        this.additional_receivers = additional_receivers;
    }
    return MessageResponse;
}());
exports.MessageResponse = MessageResponse;
