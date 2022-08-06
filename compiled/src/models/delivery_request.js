"use strict";
exports.__esModule = true;
exports.DeliveryRequest = exports.Expiration = exports.Destination = void 0;
var Destination;
(function (Destination) {
    Destination["building"] = "building";
    Destination["segel"] = "segel";
    Destination["samech"] = "samech";
    Destination["topaz"] = "topaz";
})(Destination = exports.Destination || (exports.Destination = {}));
var Expiration;
(function (Expiration) {
    Expiration["day"] = "day";
    Expiration["week"] = "week";
    Expiration["month"] = "month";
})(Expiration = exports.Expiration || (exports.Expiration = {}));
var DeliveryRequest = /** @class */ (function () {
    function DeliveryRequest() {
    }
    return DeliveryRequest;
}());
exports.DeliveryRequest = DeliveryRequest;
