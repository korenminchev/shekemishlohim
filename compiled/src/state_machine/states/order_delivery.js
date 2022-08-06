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
exports.OrderDeliveryState = void 0;
var delivery_request_1 = require("../../models/delivery_request");
var message_response_1 = require("../message_response");
var state_response_1 = require("../state_response");
var OrderDeliveryStage;
(function (OrderDeliveryStage) {
    OrderDeliveryStage[OrderDeliveryStage["Duration"] = 0] = "Duration";
    OrderDeliveryStage[OrderDeliveryStage["Contents"] = 1] = "Contents";
    OrderDeliveryStage[OrderDeliveryStage["PickedUp"] = 2] = "PickedUp";
    OrderDeliveryStage[OrderDeliveryStage["Delivered"] = 3] = "Delivered";
})(OrderDeliveryStage || (OrderDeliveryStage = {}));
var OrderDeliveryState = /** @class */ (function () {
    function OrderDeliveryState(db) {
        this.db = db;
    }
    OrderDeliveryState.prototype.onEnter = function () {
        // TODO: Check if the user has enough tokens to start the order
        this.order_stage = OrderDeliveryStage.Duration;
        return new message_response_1.MessageResponse("מתי תרצה לקבל את ההזמנה");
    };
    OrderDeliveryState.prototype.handle = function (message, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (this.order_stage) {
                    case OrderDeliveryStage.Duration:
                        switch (message.body) {
                            case "היום":
                                this.order_duration = delivery_request_1.Expiration.day;
                                break;
                            case "השבוע":
                                this.order_duration = delivery_request_1.Expiration.week;
                                break;
                            case "החודש":
                                this.order_duration = delivery_request_1.Expiration.month;
                                break;
                            default:
                                return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse("לא הבנתי למתי אתה רוצה את המשלוח"))];
                        }
                        this.order_stage = OrderDeliveryStage.Contents;
                        return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse("מה אתה רוצה מהשקם?"))];
                    case OrderDeliveryStage.Contents:
                        break;
                    case OrderDeliveryStage.PickedUp:
                        break;
                    case OrderDeliveryStage.Delivered:
                        break;
                    default:
                        break;
                }
                return [2 /*return*/, new state_response_1.StateResponse(this, new message_response_1.MessageResponse("התחלת ההזמנה"))];
            });
        });
    };
    return OrderDeliveryState;
}());
exports.OrderDeliveryState = OrderDeliveryState;
