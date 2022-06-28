"use strict";
exports.__esModule = true;
// const qrcode = require('qrcode-terminal');
var qrcode_terminal_1 = require("qrcode-terminal");
var client_manager_1 = require("./client_manager");
var whatsapp_web_js_1 = require("whatsapp-web.js");
function main() {
    console.log("Shekemishlohim Bot!");
    var client = new whatsapp_web_js_1.Client({
        authStrategy: new whatsapp_web_js_1.LocalAuth()
    });
    var client_manager = new client_manager_1.ClientManager();
    client.on('qr', function (qr) {
        qrcode_terminal_1.qrcode.generate(qr, { small: true });
    });
    client.on('ready', function () {
        console.log('Client is ready!');
    });
    client.on('message', function (message) {
        message.getChat().then(function (chat) {
            client_manager.handleClient(chat, message);
        });
        // message.reply('Hello!');
    });
    client.initialize();
}
main();
