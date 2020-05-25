const TelegramBot = require('node-telegram-bot-api');
const token="1279013555:AAHO6MSwZvyO-zGV-rtM5eaqbnLAMOM5cvI";
const mysql= require('mysql');
const express= require('express');
const app = express();
const bot=new TelegramBot(token,{polling:true});
var request=require('request');
bot.onText(/\/start/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"<b>Your letter has finally arrived!🦉</b> \n \nWhat kind of witch or wizard will you be? Will you have the courage of a <b>Gryffindor</b>? The audacity of a <b>Slytherin</b>? The insight of a <b>Ravenclaw</b>?  Loyalty of a <b>Hufflepuff</b>? <b>YOU</b> will decide! 🎓 With countless choices, you can build your own unique path in HarryPotterBot. 📬",
    {
        parse_mode:"HTML",
        "reply_markup":
        {
            "inline_keyboard": [
                [
                   
                    {
                        text:'location✨',
                        callback_data:"click"
                        
                    },
                   
                    {
                        text:'end',
                        callback_data:"click"
                        
                    }, 
                  
                ],
                [
                   
                    {
                        text:'official site✨',
                        url:"https://www.wizardingworld.com"
                        
                    },
                ]
            ]
        }
    });
});

bot.onText(/\/sortinghat/,(msg)=>
  { 
    var ID=msg.chat.id;
    request('https://www.potterapi.com/v1/sortinghat', function(error,response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(ID,'Hmm, difficult. VERY difficult'+'...',{parse_mode:'Markdown'}).then(function(msg)
            {var res = JSON.parse(body);           
            switch(res){
                case "Ravenclaw":
                    
                    bot.sendMessage(ID,"✨<b>Ravenclaws</b> possess the traits of cleverness, wisdom, wit, intellectual ability and creativity.✨",
                    {
                        parse_mode:"HTML"
                    })
                   bot.sendPhoto(ID,"Stemmacorvonero.png")
                break;
                case "Slytherin":
                   
                    bot.sendMessage(ID,"✨<b>Slytherins</b> tend to be ambitious, shrewd, cunning, strong leaders, and achievement-oriented.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"serpeverde.png")
                break;
                case "Gryffindor":
                   
                    bot.sendMessage(ID,"✨The <b>Gryffindor</b> house emphasises the traits of courage as well as 'daring, nerve, and chivalry', and thus its members are generally regarded as brave, though sometimes to the point of recklessness.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"grifondoro.png")
                break;
                  case "Hufflepuff":
                  
                    bot.sendMessage(ID,"✨<b>Hufflepuff</b> is the most inclusive among the four houses; valuing hard work, dedication, patience, loyalty, and fair play rather than a particular aptitude in its members.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"tassorosso.png")
                break;
                }}
            
            )}
         
    }
)});

bot.onText(/\/characters (.+)/,(msg,match)=>
  { var stud=match[1] ? match[1] :"";
    var ID=msg.chat.id;

    let url='https://www.potterapi.com/v1/characters?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy&name='+stud;
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for '+stud,{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          bot.sendMessage(ID,'Name🤝:'+par[0].name+'\nHome🌍:'+par[0].house+'\nSchool🏰:'+par[0].school+'\nAlias🔍:'+par[0].alias+'\nWand✨:'+par[0].wand);
    }})
            
         
    
});
 
bot.onText(/\/house (.+)/,(msg)=>
  {
    var ID=msg.chat.id;

    let url='http://hp-api.herokuapp.com/api/characters/house/'+house;
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for ',{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          for(let i=0;i<par.length;i++){
          bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nPhoto🌍:'+par[i].image);}
    }})
            
         
    
});

bot.onText(/\/spells/,(msg,match)=>
  { var spell=match[1] ? match[1] :"";
    var ID=msg.chat.id;

    let url='https://www.potterapi.com/v1/spells?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for '+spell,{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          bot.sendMessage(ID,'Name🤝:'+par[0].spell);
    }})

});

bot.onText(/\/staff/,(msg)=>
  {
    var ID=msg.chat.id;
    let url='http://hp-api.herokuapp.com/api/characters/staff';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for ',{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          for(let i=0;i<par.length;i++){
            bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nPhoto🌍:'+par[i].image);}
    }})

});

bot.onText(/\/mostimportants/,(msg)=>
  {
    var ID=msg.chat.id;
    let url='http://hp-api.herokuapp.com/api/characters';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for ',{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          for(let i=0;i<par.length;i++){
            bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nActor🌍:'+par[i].actor+'\nAlive🌍:'+par[i].alive+'\nPhoto🌍:'+par[i].image);}
    }})

});


bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
 
    let array=callbackQuery.data;
    
        bot.answerCallbackQuery(callbackQuery.id)
        .then(() =>
        {if(array.includes("click"))
        { bot.sendMessage(msg.chat.id,"This page will provide location of places mentioned and visited in the Harry Potter series🌍",
        {
            parse_mode:"HTML",
            "reply_markup":
            {
                "inline_keyboard": [
                    [
                        {
                            text: "Alnwick castle🏰",
                            callback_data:"castle",
                                     
                        },
                        {
                            text: "location✨",
                            callback_data:"click",
                            
                        },
                        
                    ],
                ],
            }
            
        })
   } 
})})
 

 bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
 
    let array=callbackQuery.data;
    
        bot.answerCallbackQuery(callbackQuery.id)
        .then(() =>
        {if(array.includes("castle")){bot.sendLocation(msg.chat.id,55.41558,-1.70592);}  
        })
   } 
)