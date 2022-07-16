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
exports.RegisterState = exports.MORE_INFO = void 0;
var state_ids_1 = require("./state_ids");
var message_response_1 = require("../message_response");
var user_1 = require("../../models/user");
var welcome_1 = require("./welcome");
var state_response_1 = require("../state_response");
var RegisterStage;
(function (RegisterStage) {
    RegisterStage[RegisterStage["Begin"] = 0] = "Begin";
    RegisterStage[RegisterStage["WaitingForName"] = 1] = "WaitingForName";
    RegisterStage[RegisterStage["WaitingForFloor"] = 2] = "WaitingForFloor";
})(RegisterStage || (RegisterStage = {}));
var NAME_REQUEST = "\u05D0\u05D6 \u05D1\u05D5\u05D0\u05D5 \u05E0\u05EA\u05D7\u05D9\u05DC, \u05E8\u05E7 2 \u05E4\u05E8\u05D8\u05D9\u05DD \u05E7\u05D8\u05E0\u05D9\u05DD!\n\u05D0\u05D9\u05DA \u05E7\u05D5\u05E8\u05D0\u05D9\u05DD \u05DC\u05DA?";
var FLOOR_REQUEST = "?\u05D1\u05D0\u05D9\u05D6\u05D4 \u05E7\u05D5\u05DE\u05D4 \u05D0\u05EA.\u05D4\n(1 - 6)\n(\u05D2) - \u05D2\u05E0\u05E1\u05D9\u05E1\n(\u05E1) - \u05E1\u05DE\u05DA\n(\u05D8) - \u05D8\u05D5\u05E4\u05D6";
var INVALID_FLOOR = "\u05E1\u05D5\u05E8\u05D9, \u05DC\u05D0 \u05D4\u05D1\u05E0\u05EA\u05D9 \u05D1\u05D0\u05D9\u05D6\u05D4 \u05E7\u05D5\u05DE\u05D4 \u05D0\u05EA.\u05D4 :(\n" + FLOOR_REQUEST;
var THANKS_FOR_REGISTERING = "\u05EA\u05D5\u05D3\u05D4 \u05E2\u05DC \u05D4\u05D4\u05E8\u05E9\u05DE\u05D4!";
exports.MORE_INFO = "\u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05E4\u05E2\u05D9\u05DC \u05D0\u05D1\u05DC \u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05E2\u05DC \u05D6\u05D4 \u05E7\u05E9\u05D4 \u05D5\u05E0\u05E9\u05DC\u05D7 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05D1\u05E8\u05D2\u05E2 \u05E9\u05D4\u05DB\u05DC \u05D9\u05D4\u05D9\u05D4 \u05DE\u05D5\u05DB\u05DF!\n\n\u05DC\u05E2\u05D5\u05D3 \u05DE\u05D9\u05D3\u05E2 \u05D5\u05E9\u05D0\u05DC\u05D5\u05EA \u05DE\u05D5\u05D6\u05DE\u05E0\u05D9\u05DD \u05DC\u05DB\u05EA\u05D5\u05D1 \u05DC\u05E7\u05D5\u05E8\u05DF - https://wa.me/972544917728";
var RegisterState = /** @class */ (function () {
    function RegisterState(db) {
        this.state_id = state_ids_1.StateId.Register;
        this.supported_messages = [];
        this.db = db;
        this.stage = RegisterStage.Begin;
    }
    RegisterState.prototype.onEnter = function () {
        this.stage = RegisterStage.WaitingForName;
        return { sender_response: NAME_REQUEST };
    };
    RegisterState.prototype.handle = function (message, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var floor;
            return __generator(this, function (_a) {
                switch (this.stage) {
                    case RegisterStage.WaitingForName:
                        this.phone_number = user_id;
                        this.name = message.body;
                        this.stage = RegisterStage.WaitingForFloor;
                        return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse(FLOOR_REQUEST))];
                    case RegisterStage.WaitingForFloor:
                        floor = parseInt(message.body);
                        if (isNaN(floor)) {
                            console.log(message.body);
                            switch (message.body) {
                                case "ג":
                                    floor = 'g';
                                    break;
                                case "ס":
                                    floor = 's';
                                    break;
                                case "ט":
                                    floor = 't';
                                    break;
                                default:
                                    return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse(INVALID_FLOOR))];
                            }
                        }
                        else {
                            if (floor < 1 || floor > 6) {
                                return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse(INVALID_FLOOR))];
                            }
                        }
                        this.db.createUser(new user_1.User(user_id, this.name, 2, floor));
                        return [2 /*return*/, new state_response_1.StateResponse(new welcome_1.WelcomeState(this.db), new message_response_1.MessageResponse(THANKS_FOR_REGISTERING + "\n" + exports.MORE_INFO))];
                }
                return [2 /*return*/];
            });
        });
    };
    return RegisterState;
}());
exports.RegisterState = RegisterState;
