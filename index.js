const TelegramBot = require('node-telegram-bot-api');
const token="1279013555:AAHO6MSwZvyO-zGV-rtM5eaqbnLAMOM5cvI";

const bot=new TelegramBot(token,{polling:true});

bot.on('message',(msg)=>
{
    var hi = "Ciao";
    if(msg.text.toString().toLowerCase().indexOf(hi)===0)
    {
        bot.sendMessage(msg.chat.id,"lol");
    }
}
);

bot.onText(/\/start/,(msg)=>{bot.sendMessage(msg.chat.id,"welcome")});