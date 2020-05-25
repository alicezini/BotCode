const TelegramBot = require('node-telegram-bot-api');
const token="1279013555:AAHO6MSwZvyO-zGV-rtM5eaqbnLAMOM5cvI";


const express= require('express');
const app = express();

const bot=new TelegramBot(token,{polling:true});
var request=require('request');

const sqlite3=require('sqlite3').verbose();

let db=new sqlite3.Database('./harrypotter.db',(err)=>
{
    if(err)
    {
        console.error(err.message);
    }
    console.log("Connessione riuscita")
}

);

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
                        text:'about me💫',
                        callback_data:"me"
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
                   bot.sendPhoto(ID,"assets/Stemmacorvonero.png")
                break;
                case "Slytherin":
                   
                    bot.sendMessage(ID,"✨<b>Slytherins</b> tend to be ambitious, shrewd, cunning, strong leaders, and achievement-oriented.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"assets/serpeverde.png")
                break;
                case "Gryffindor":
                   
                    bot.sendMessage(ID,"✨The <b>Gryffindor</b> house emphasises the traits of courage as well as 'daring, nerve, and chivalry', and thus its members are generally regarded as brave, though sometimes to the point of recklessness.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"assets/grifondoro.png")
                break;
                  case "Hufflepuff":
                  
                    bot.sendMessage(ID,"✨<b>Hufflepuff</b> is the most inclusive among the four houses; valuing hard work, dedication, patience, loyalty, and fair play rather than a particular aptitude in its members.✨",
                    {
                        parse_mode:"HTML"
                    })
                    bot.sendPhoto(ID,"assets/tassorosso.png")
                break;
                }
                
            }
            
            )}
         
    }
)});

bot.onText(/\/characters (.+)/,(msg,match)=>
  { var stud=match[1] ? match[1] :"";
    var ID=msg.chat.id;
    let url='https://www.potterapi.com/v1/characters?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy&name='+stud;
    
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200)
        {
            bot.sendMessage(ID,'looking for '+stud,{parse_mode:'Markdown'});
            var b=body;
            const par=JSON.parse(b);
            console.log(par);
          if(par.length==0)
          { 
              bot.sendMessage(ID,"Error: remember to enter name and surname with capital letter ex: Harry Potter.");}
          else
          {
              bot.sendMessage(ID,'Name🤝:'+par[0].name+'\nHome🌍:'+par[0].house+'\nSchool🏰:'+par[0].school+'\nAlias🔍:'+par[0].alias+'\nWand✨:'+par[0].wand);
          }
        }})

});
 
bot.onText(/\/house (.+)/,(msg,match)=>
  { 
    var house=match[1] ? match[1] :"";
    var ID=msg.chat.id;
    bot.on("polling_error", (err) => console.log(err));
    let url='http://hp-api.herokuapp.com/api/characters/house/'+house;

    request(url, function(error,response,body)
    { 
        if(house!="ravenclaw"&&house!="gryffindor"&&house!="hufflepuff"&&house!="slytherin")
        {
        bot.sendMessage(ID,"Use one of these \nravenclaw\ngryffindor\nhufflepuff\nslytherin");
        }
        else if(!error&&response.statusCode==200)
        {
           bot.sendMessage(ID,'looking for '+house,{parse_mode:'Markdown'});
           var b=body;
           const par=JSON.parse(b);
           console.log(par);
           for(let i=0;i<par.length;i++)
           {
          bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nPhoto🌍:'+par[i].image);}
       
    } ;})
});

bot.onText(/\/spells (.+)/,(msg,match)=>
  { var spells=match[1] ? match[1] :"";
    var ID=msg.chat.id;

    let url='https://www.potterapi.com/v1/spells?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
          var b=body;
          const par=JSON.parse(b);
          var tabellaUtenti = []
          tabellaUtenti = par;
          var prod=[]
          prod=tabellaUtenti.filter(function(item) {
            return item.spell === spells;
          });   
          if(prod.length==0)
          { 
              bot.sendMessage(ID,"Error: remember to enter name with capital letter ex: Accio.");}
              else
         { bot.sendMessage(ID,'Spell✨:'+prod[0].spell+'\nType✨:'+prod[0].type+'\nEffect✨:'+prod[0].effect);}
    }})

});

bot.onText(/\/staff/,(msg)=>
  {
    var ID=msg.chat.id;
    let url='http://hp-api.herokuapp.com/api/characters/staff';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
           
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          for(let i=0;i<par.length;i++){
            bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nActor🎥:'+par[i].actor+'\nPhoto🌍:'+par[i].image);}
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
            bot.sendMessage(ID,'Name🤝:'+par[i].name+'\nActor🎥:'+par[i].actor+'\nAlive🌍:'+par[i].alive+'\nPhoto🌍:'+par[i].image);}
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
                            text: "Platform 9 3/4🚂 ",
                            callback_data:"platform",
                            
                        },
                        {
                            text: "Privet drive🔒",
                            callback_data:"drive",
                            
                        },
                      
                    ],
                    [
                    {
                        text: "back⚡️",
                        callback_data:"back",
                    }
                ],
            ]
            }
            }
        )
    } 
})})
 

 bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
 
    let array=callbackQuery.data;
    
        bot.answerCallbackQuery(callbackQuery.id)
        .then(() =>
        {
            if(array.includes("castle"))
        {
            bot.sendLocation(msg.chat.id,55.41558,-1.70592);
            bot.sendMessage(msg.chat.id,"<em>Alnwick Castle is the location used for Hogwarts Castle in ‘Harry Potter and the Philosopher’s Stone’ and ‘Harry Potter and the Chamber of Secrets.’  This is where you see Harry having broomstick lessons.</em>",
            {
                parse_mode:"HTML",
            
            });
            bot.sendPhoto(msg.chat.id,"assets/castello.jpg");
         
        }  
        if(array.includes("platform"))
        {
            bot.sendLocation(msg.chat.id,51.53605,-0.12513);
            bot.sendMessage(msg.chat.id,"<em>Platform 9 3/4 was filmed at King’s Cross station in London on platforms 4 and 5.  The beautiful exterior shots were of  St Pancras Station.</em>",
            {
                parse_mode:"HTML"
            });
            bot.sendPhoto(msg.chat.id,"assets/piattaforma.jpg");
            
        }  
        if(array.includes("drive"))
        {
            bot.sendLocation(msg.chat.id,37.56594,-122.385798);
            bot.sendMessage(msg.chat.id,"<em>The Dursley family home was really 12 Picket Post Close, Winkfiled Row in Bracknell.</em>",
            {
                parse_mode:"HTML"
            });
            bot.sendPhoto(msg.chat.id,"assets/privet.jpg"); 
        }  
        if(array.includes("back"))
        {
            bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => console.error(err)).finally(() =>
            bot.answerCallbackQuery(callbackQuery.id))
        }
        if(array.includes("me"))
        {
            bot.sendMessage(msg.chat.id,"<b>Alice Zini</b> \n5^H Informatica, ISII G. Marconi, Piacenza",
            {
                parse_mode:"HTML"
            });
        }
        })
   } 
)

bot.onText(/\/patronus/,(msg)=>
{
    let sql="SELECT * FROM patronus";

db.all(sql,[],(err,rows)=>
{
    if(err)
    {
        throw err;
    }
    rows.forEach((row)=>
    {
        console.dir(row);
        bot.sendMessage(msg.chat.id,row[1]);
    }
    )
})
}
)