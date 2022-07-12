"use strict";
exports.__esModule = true;
exports.ClientManager = void 0;
var state_machine_1 = require("./state_machine/state_machine");
var MILLISECONDS_IN_SECOND = 1000;
var MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;
var ClientManager = /** @class */ (function () {
    function ClientManager() {
        this.clientMapping = {};
        this.clientTimeouts = {};
    }
    ClientManager.prototype.handleClient = function (chat, lastClientMessage) {
        var _this = this;
        // Disabling chat reset for now
        if (false) {
            // Remove the current timeout if it exists
            if (this.clientTimeouts[chat.id._serialized]) {
                clearTimeout(this.clientTimeouts[chat.id._serialized]);
            }
            // Remove the client message handler in 10 minutes
            this.clientTimeouts[chat.id._serialized] =
                setTimeout(function () { return delete _this.clientMapping[chat.id._serialized]; }, 10 * MILLISECONDS_IN_MINUTE);
        }
        if (!this.clientMapping[chat.id._serialized]) {
            this.clientMapping[chat.id._serialized] = new state_machine_1.StateMachine(chat);
        }
        this.clientMapping[chat.id._serialized].handleMessage(lastClientMessage);
    };
    return ClientManager;
}());
exports.ClientManager = ClientManager;
