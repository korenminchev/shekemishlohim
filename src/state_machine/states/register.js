"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.RegisterState = void 0;
var state_ids_1 = require("./state_ids");
var message_response_1 = require("../message_response");
var json_db_1 = require("../../db/json/json_db");
var user_1 = require("../../models/user");
var welcome_1 = require("./welcome");
var state_response_1 = require("../state_response");
var RegisterStage;
(function (RegisterStage) {
    RegisterStage[RegisterStage["Begin"] = 0] = "Begin";
    RegisterStage[RegisterStage["WaitingForName"] = 1] = "WaitingForName";
    RegisterStage[RegisterStage["WaitingForFloor"] = 2] = "WaitingForFloor";
})(RegisterStage || (RegisterStage = {}));
var RegisterState = /** @class */ (function () {
    function RegisterState() {
        this.state_id = state_ids_1.StateId.Register;
        this.supported_messages = [];
        this.stage = RegisterStage.Begin;
    }
    RegisterState.prototype.onEnter = function () {
        this.stage = RegisterStage.WaitingForName;
        return { sender_response: "What's your name?" };
    };
    RegisterState.prototype.handle = function (message, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (this.stage) {
                    case RegisterStage.WaitingForName:
                        this.phone_number = user_id;
                        this.name = message.body;
                        this.stage = RegisterStage.WaitingForFloor;
                        return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse("What floor are you from?"))];
                    case RegisterStage.WaitingForFloor:
                        this.floor = parseInt(message.body);
                        if (isNaN(this.floor) || this.floor > 6) {
                            return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse("Invalid floor number. What floor are you from?"))];
                        }
                        json_db_1.JsonDB.getInstance().updateUser(new user_1.User(user_id, this.name, 2, this.floor));
                        return [2 /*return*/, new state_response_1.StateResponse(new welcome_1.WelcomeState(), new message_response_1.MessageResponse("Thanks for registering!"))];
                }
                return [2 /*return*/];
            });
        });
    };
    return RegisterState;
}());
exports.RegisterState = RegisterState;
