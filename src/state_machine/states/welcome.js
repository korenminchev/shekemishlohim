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
exports.WelcomeState = void 0;
var state_ids_1 = require("./state_ids");
var message_response_1 = require("../message_response");
var register_1 = require("./register");
var state_response_1 = require("../state_response");
var EXPLAINATION_MESSAGE = "\u05D4\u05D9\u05D9! \u05D0\u05D6 \u05DE\u05D4 \u05D6\u05D4 \u05E9\u05E7\u05DE\u05E9\u05DC\u05D5\u05D7\u05D9\u05DD?\n\u05DE\u05DB\u05D9\u05E8\u05D9\u05DD \u05D0\u05EA \u05D6\u05D4 \u05DB\u05E9\u05D0\u05EA\u05DD \u05D1\u05DE\u05E9\u05E8\u05D3 \u05D5\u05D1\u05D0 \u05DC\u05DB\u05DD \u05DE\u05E9\u05D4\u05D5 \u05DE\u05D4\u05E9\u05E7\u05DD \u05D0\u05D1\u05DC \u05D0\u05D9\u05DF \u05DC\u05DB\u05DD \u05DB\u05D5\u05D7 \u05DC\u05E6\u05D0\u05EA \u05DE\u05DE\u05E6\u05D5\u05D1 \u05D1\u05E9\u05D1\u05D9\u05DC \u05D6\u05D4?\n\u05E2\u05DD \u05E9\u05E7\u05DE\u05E9\u05DC\u05D5\u05D7\u05D9\u05DD \u05D0\u05E0\u05E9\u05D9\u05DD \u05E9\u05DB\u05D1\u05E8 \u05E0\u05DE\u05E6\u05D0\u05D9\u05DD \u05D1\u05E9\u05E7\u05DD \u05D9\u05D5\u05DB\u05DC\u05D5 \u05DC\u05E7\u05D7\u05EA \u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DB\u05DD \u05D5\u05DC\u05D4\u05D1\u05D9\u05D0 \u05D0\u05D5\u05EA\u05D4 \u05E7\u05E8\u05D5\u05D1 \u05DE\u05E1\u05E4\u05D9\u05E7 \u05D0\u05DC\u05D9\u05DB\u05DD!\n\u05DB\u05DC \u05D6\u05D4 \u05D1\u05E6\u05D9\u05E4\u05D9\u05D9\u05D4 \u05E9\u05DB\u05E9\u05D0\u05EA\u05DD \u05EA\u05D4\u05D9\u05D5 \u05E9\u05DD \u05D0\u05D6 \u05EA\u05E7\u05D7\u05D5 \u05DE\u05D3\u05D9 \u05E4\u05E2\u05DD \u05DC\u05DE\u05D9\u05E9\u05D4\u05D5 \u05E9\u05E7\u05D9\u05EA \u05DC\u05D1\u05E0\u05D9\u05D9\u05DF ;)";
var WelcomeState = /** @class */ (function () {
    function WelcomeState(db) {
        this.state_id = state_ids_1.StateId.Welcome;
        this.supported_messages = ["אני בשקם", "אני רוצה משלוח", "משלוח", "בשקם", "ש", "מ"];
        this.db = db;
    }
    WelcomeState.prototype.onEnter = function () {
        return null;
    };
    WelcomeState.prototype.handle = function (message, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getUser(user_id).then(function (user) {
                            console.log("User: " + user);
                            response = new state_response_1.StateResponse(_this, new message_response_1.MessageResponse("\u05D4\u05D9\u05D9 ".concat(user.name, " :)\n").concat(register_1.MORE_INFO)));
                        })["catch"](function () {
                            console.log("User not found");
                            response = new state_response_1.StateResponse(new register_1.RegisterState(_this.db), new message_response_1.MessageResponse(EXPLAINATION_MESSAGE));
                        })];
                    case 1:
                        _a.sent();
                        console.log(response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return WelcomeState;
}());
exports.WelcomeState = WelcomeState;
