const Bot = require("node-telegram-bot-api");

const bot = new Bot("522910329:AAHnueFevFwgr6oSiEGpT-KV9EwexlHJg7U", { polling: true });

const blockchain = require("./blockchain");

const EthCrypto = require("eth-crypto");

/*
bot.onText(/\/start/, (message) => {
    bot.sendMessage(message.chat.id, `
        /generate
        /publish (authorAddress) (name)
        /share (courseAddress) (studentAddress)
        /share_confirm (magic from /share)
        /access (courseID) (tokenID)
    `);
});
*/

bot.onText(/\/start/, (message) => {
   bot.sendMessage(message.chat.id, "Menu", {
       reply_markup: {
           inline_keyboard: [
               [{
                    text: "Сгенерировать ключ",
                    url: "https://7flash.github.io/blockchain-education/bot/generate.html"
               }],
               [{
                    text: "Опубликовать курс",
                    url: "https://7flash.github.io/blockchain-education/bot/publish.html"
               }],
               [{
                    text: "Открыть доступ ученику",
                    url: "https://7flash.github.io/blockchain-education/bot/share.html"
               }],
               [{
                    text: "Расшифровать курс",
                    url: "https://7flash.github.io/blockchain-education/bot/access.html"
               }]
           ]
       }
   })
});

bot.onText(/\/publish/, async (message) => {
    const data = JSON.parse(message.text.slice(8));

    const courseName = data.name;
    const authorAddress = data.address;
    const signature = data.signature;

    const vrs = EthCrypto.vrs.fromString(signature);

    const courseAddress = await blockchain.publish(authorAddress, courseName, vrs);

    bot.sendMessage(message.chat.id, courseAddress);
});

bot.onText(/\/share/, async (message) => {
    const data = JSON.parse(message.text.splice(6));

    const courseID = data.course;
    const studentAddress = data.address;
    const link = data.link;

    const signature = data.signature;

    const vrs = EthCrypto.vrs.fromString(signature);

    const tokenID = await blockchain.share(courseID, studentAddress, link, vrs);

    bot.sendMessage(message.chat.id, tokenID);
});

bot.onText(/\/access/, async (message) => {
    const data = JSON.parse(message.text.splice(7));

    const courseID = data.courseID;
    const tokenID = data.tokenID;

    const link = await blockchain.access(courseID, tokenID);

    bot.sendMessage(message.chat.id, link);
});