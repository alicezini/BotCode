const TelegramBot = require('node-telegram-bot-api'); 
const token="1279013555:AAHO6MSwZvyO-zGV-rtM5eaqbnLAMOM5cvI";//token del mio bot telegram ottenuto con Botfather
const express = require('express');
const app = express();
const bot=new TelegramBot(token,{polling:true});
var request=require('request');

var port =process.env.PORT || 3000;
app.listen(port,()=>console.log("server in ascolto"+port))

const sqlite3=require('sqlite3').verbose(); //decido di utilizzare sqlite3

let db=new sqlite3.Database('./harrypotter.db',(err)=>//in questa parte del codice sto facendo a connessione al 
{                                                     //mio dataabase in SQLite 
    if(err)
    {
        console.error(err.message);
    }
    console.log("Connessione riuscita")
}

);

//la prima cosa che l'utente visualizzerà non appena scriverà /start sarà il messaggio di benvenuto 
bot.onText(/\/start/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"<b>Your letter has finally arrived!🦉</b> \n \nWhat kind of witch or wizard will you be? Will you have the courage of a <b>Gryffindor</b>? The audacity of a <b>Slytherin</b>? The insight of a <b>Ravenclaw</b>?  Loyalty of a <b>Hufflepuff</b>? <b>YOU</b> will decide! 🎓 With countless choices, you can build your own unique path in HarryPotterBot. 📬",
    {
        parse_mode:"HTML",
        "reply_markup":
        {
            "inline_keyboard": [
                [
                   //ho deciso di rendere alcuni comandi interattivi,
                   //dato che non necessitano di particolari parametri
                    {
                        text:'Location✨',
                        callback_data:"click"
                    },
                   
                    {
                        text:'About me💫',
                        callback_data:"me"
                    },     
                ],
                [
                   //collegamento al sito ufficiale di Harry Potter
                    {
                        text:'Official site✨',
                        url:"https://www.wizardingworld.com" 
                    },
                ]
            ]
        }
    });
});


//la seconda funzione è quella dello smistamento nella casata
//utilizzo un api messa a disposizione da un sito
//che scegelierà casualmente una casata 
bot.onText(/\/sortinghat/,(msg)=>
  { 
    var ID=msg.chat.id;
    request('https://www.potterapi.com/v1/sortinghat', function(error,response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(ID,'Hmm, difficult. VERY difficult'+'...',{parse_mode:'Markdown'}).then(function(msg)
            {var res = JSON.parse(body);           
            switch(res){
                case "Ravenclaw":
                    //ho deciso per abbellire di aggiungere descrizione e foto
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
//funzione characters questa richiede dei parametri (Nome e Cognome)
//uso sempre un api che richiede la chiave in questo caso
bot.onText(/\/characters (.+)/,(msg,match)=>
  { var stud=match[1] ? match[1] :"";
    var ID=msg.chat.id;
    let url='https://www.potterapi.com/v1/characters?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy&name='+stud;
    bot.sendMessage(ID,'looking for '+stud,{parse_mode:'Markdown'});
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200)
        {
            
            var b=body;
            const par=JSON.parse(b);
            console.log(par);
          if(par.length==0)//controllo che il personaggio esista
          { //messaggio per ricordare di usare le lettere maiuscole
              bot.sendMessage(ID,"Error: remember to enter name and surname with capital letter ex: Harry Potter.");
          }
          else
          {
              bot.sendMessage(ID,'<b>Name</b>🤝:'+par[0].name+'\n<b>Home</b>🌍:'+par[0].house+'\n<b>School</b>🏰:'+par[0].school+'\n<b>Alias</b>🔍:'+par[0].alias+'\n<b>Wand</b>✨:'+par[0].wand,
              {
                parse_mode:"HTML"
              }
              );
          }
        }})

});

//questa funzione permette di vedere i componeneti di una determinata casata
//in questo caso utilizzo sempre api fornite da un sito ma differente da quello precedente
bot.onText(/\/house (.+)/,(msg,match)=>
  { 
    var house=match[1] ? match[1] :"";
    var ID=msg.chat.id;
    bot.on("polling_error", (err) => console.log(err));
    let url='http://hp-api.herokuapp.com/api/characters/house/'+house;
    bot.sendMessage(ID,'looking for '+house,{parse_mode:'Markdown'});
    
    request(url, function(error,response,body)
    { 
        //se la casa inserita non è giusta messaggio che permette di vedere le opzioni
        if(house!="ravenclaw"&&house!="gryffindor"&&house!="hufflepuff"&&house!="slytherin")
        {
        bot.sendMessage(ID,"Use one of these \nravenclaw\ngryffindor\nhufflepuff\nslytherin");
        }
        else if(!error&&response.statusCode==200)
        {
          
           var b=body;
           const par=JSON.parse(b);
           console.log(par);
           for(let i=0;i<par.length;i++)
           {//utilizzo un for per stampare tutti i risultati
            bot.sendMessage(ID,'<b>Name</b>🤝:'+par[i].name+'\n<b>Photo</b>🌍:'+par[i].image,
            {
                parse_mode:"HTML"
            }
            );
           }
       
    } ;})
});

//questa funzione permette una volta cercato un incantesimo di vederne le caratteristiche
bot.onText(/\/spells (.+)/,(msg,match)=>
  { 
      var spells=match[1] ? match[1] :"";
    var ID=msg.chat.id;
    let url='https://www.potterapi.com/v1/spells?key=$2a$10$wmgxJf6kxBPsX3en7UlLh.OiMRN.sPMl8/PzOJJPBTBrWVTA2NMfy';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
          var b=body;
          const par=JSON.parse(b);
          var tabellaUtenti = []
          tabellaUtenti = par; //qui ho avuto un po' di problemi perchè l'api non permetteva di visualizzare gli incantesimi  
          var prod=[]          //in base ad esempio al nome, essendo gratuite non sono perfette
          prod=tabellaUtenti.filter(function(item) {//quindi mi sono creata una tabella e ho usato le proprietà degli array
            return item.spell === spells;           //e funziona perfettamente
          });   
          if(prod.length==0)
          { 
              bot.sendMessage(ID,"Error: remember to enter name with capital letter ex: Accio.");}
              else
         { bot.sendMessage(ID,'<b>Spell</b>✨:'+prod[0].spell+'\n<b>Type</b>✨:'+prod[0].type+'\n<b>Effect</b>✨:'+prod[0].effect,
         {
            parse_mode:"HTML"
         }
         );}
    }})

});

//questa è la funzione che visualizza tutto lo staff della scuola di hogwarts
//stampa tutto l'elenco
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
            bot.sendMessage(ID,'<b>Name</b>🤝:'+par[i].name+'\n<b>Actor</b>🎥:'+par[i].actor+'\n<b>Photo</b>🌍:'+par[i].image,
            {
                parse_mode:"HTML"
            }
            );}
    }})

});

//simile al funzione precedente stampa però i personaggi più importanti
bot.onText(/\/mostimportants/,(msg)=>
  { bot.sendMessage(ID,'looking for ',{parse_mode:'Markdown'});
    var ID=msg.chat.id;
    let url='http://hp-api.herokuapp.com/api/characters';
    request(url, function(error,response,body){
        if(!error&&response.statusCode==200){
            bot.sendMessage(ID,'looking for ',{parse_mode:'Markdown'});
           var b=body;
          const par=JSON.parse(b);
          console.log(par);
          for(let i=0;i<par.length;i++){
            bot.sendMessage(ID,'<b>Name</b>🤝:'+par[i].name+'\n<b>Actor</b>🎥:'+par[i].actor+'\n<b>Alive</b>🌍:'+par[i].alive+'\n<b>Photo</b>🌍:'+par[i].image,
            {
                parse_mode:"HTML"
            });
        }
    }})

});

//questa funzione gestisce i pulsanti iniziali
bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
 
    let array=callbackQuery.data;
    
        bot.answerCallbackQuery(callbackQuery.id)
        .then(() =>
        //qui dico che se la callback_data contiene la parola click
        //deve mostrare un'altra pagina con altri bottoni
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
    }  //qui il bottone mostra le mie informazioni
        if(array.includes("me"))
        {
        bot.sendMessage(msg.chat.id,"<b>Alice Zini</b> \n5^H Informatica, ISII G. Marconi, Piacenza",
        {
            parse_mode:"HTML",
            "reply_markup":
            {
                "inline_keyboard": [
                    [
                        {
                            text: "Back⚡️",
                            callback_data:"back",
                                     
                        },
                    ],
                  
            ]
            }
        });
        }
})})
 

 bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
 
    let array=callbackQuery.data;
    
        bot.answerCallbackQuery(callbackQuery.id)
        .then(() =>
        {
            //se la callback_data contiene castle mostrerà foto descrizione e posizione del castello
            if(array.includes("castle"))
        {
            bot.sendLocation(msg.chat.id,55.41558,-1.70592);
            bot.sendMessage(msg.chat.id,"<em>Alnwick Castle is the location used for Hogwarts Castle in ‘Harry Potter and the Philosopher’s Stone’ and ‘Harry Potter and the Chamber of Secrets.’  This is where you see Harry having broomstick lessons.</em>",
            {
                parse_mode:"HTML",
            
            });
            bot.sendPhoto(msg.chat.id,"assets/castello.jpg");
         
        } 
         //stessa procedura del castello
        if(array.includes("platform"))
        {
            bot.sendLocation(msg.chat.id,51.53605,-0.12513);
            bot.sendMessage(msg.chat.id,"<em>Platform 9 3/4 was filmed at King’s Cross station in London on platforms 4 and 5.  The beautiful exterior shots were of  St Pancras Station.</em>",
            {
                parse_mode:"HTML"
            });
            bot.sendPhoto(msg.chat.id,"assets/piattaforma.jpg");
            
        }
        //stessa procedura del castello  
        if(array.includes("drive"))
        {
            bot.sendLocation(msg.chat.id,37.56594,-122.385798);
            bot.sendMessage(msg.chat.id,"<em>The Dursley family home was really 12 Picket Post Close, Winkfiled Row in Bracknell.</em>",
            {
                parse_mode:"HTML"
            });
            bot.sendPhoto(msg.chat.id,"assets/privet.jpg"); 
        }
        //in questo caso per tornare indietro ho trovato su internet questo metodo che cancella l'ultimo messaggio
        //così sembrerà di essere tornati al messaggio precedente  
        if(array.includes("back"))
        {
            bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => console.error(err)).finally(() =>
            bot.answerCallbackQuery(callbackQuery.id))
        }
        })
   } 
)

//per questa funzione non ho trovato api online quindi ho creato un database
//nel database ho la tabella patronus con nome info e foto
bot.onText(/\/patronus/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"Relax... think of your happiest memory...⏳");
    let id=-1;
    let sql="SELECT id FROM patronus";
    let array=[];
db.all(sql,[],(err,rows)=>
{
    if(err)
    {
        throw err;
    }
    rows.forEach((row)=>
    {
        var a=row;
        array.push(a["id"]);
        console.dir(row);
    }
    //dato che deve essere generato a caso, prima creo una query
    //per selezionare gli id 
    )
    var c=array[array.length-1]+1;
    //in questo while confronto un id generato in modo random con gli id 
    //presenti nella mia tabella
    //continua a eseguire il ciclo fino a quando non ne trova uno corrispondente
    while(!array.includes(id))
    { 
        id=getRandomIntInclusive(1,c);
    
    }
    //di conseguenza una volta trovato il mio id eseguo una seconda query per le informazioni che mi servono
    let sql2="SELECT patronus.name, patronus.info, patronus.photo1 FROM patronus WHERE id="+id;
    db.all(sql2,[],(err,rows)=>
    {
        if(err)
        {
            throw err;
        }
        rows.forEach((row)=>
        {
            var b=row;
            console.dir(row);
            bot.sendMessage(msg.chat.id,"⚡️Your Patronus is "+b["name"]);
            bot.sendMessage(msg.chat.id,"⚡️"+b["info"]+"⚡️");
            bot.sendPhoto(msg.chat.id,b["photo1"]);
        }
        )
       
    }
)

})
 }
)
//funzione per generare numeri random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

//questa funzione genererà randomicamente una curiosità salvata nel mio database
bot.onText(/\/curiosity/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"Think you know everything there is to know about JK Rowling's boy wizard?🎇");
    let id=-1;
    let sql="SELECT id FROM news";
    let array=[];
   
db.all(sql,[],(err,rows)=>
{
    if(err)
    {
        throw err;
    }
    rows.forEach((row)=>
    {
        var a=row;
        array.push(a["id"]);
        console.dir(row);
    }
    //dato che deve essere generato a caso, prima creo una query
    //per selezionare gli id 
    )
    var c=array[array.length-1]+1;
    //in questo while confronto un id generato in modo random con gli id 
    //presenti nella mia tabella
    //continua a eseguire il ciclo fino a quando non ne trova uno corrispondente
    while(!array.includes(id))
    { 
        id=getRandomIntInclusive(1,c);
    
    }
    //di conseguenza una volta trovato il mio id eseguo una seconda query per le informazioni che mi servono
    let sql2="SELECT news.descrizione FROM news WHERE id="+id;
    db.all(sql2,[],(err,rows)=>
    {
        if(err)
        {
            throw err;
        }
        rows.forEach((row)=>
        {
            var b=row;
            
            console.dir(row);
             bot.sendMessage(msg.chat.id,"⚡️"+b["descrizione"]+"⚡️");
            
        }
        )
       
    }
)

})
 }
)

//questa funzione crea dei bottoni collegati al sito dove si possono leggere delle storie
//originali J.K. Rowling
bot.onText(/\/originals/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"Explore the inner workings of the wizarding world with a collection of writing from <b>J.K. Rowling</b>📬",
    {
        parse_mode:"HTML",
        "reply_markup":
        {
            "inline_keyboard": [
                [
                   //ho deciso di rendere alcuni comandi interattivi,
                    {
                        text:'Sortinghat✨',
                        url:"https://www.wizardingworld.com/writing-by-jk-rowling/the-sorting-hat"
                    },
                   
                    {
                        text:'The Potter family💫',
                        url:"https://www.wizardingworld.com/writing-by-jk-rowling/the-potter-family"
                    },    
                ],
                [ 
                    {
                        text:'The Hogwarts Express✨',
                        url:"https://www.wizardingworld.com/writing-by-jk-rowling/the-hogwarts-express"
                    },
                    {
                        text:'The Marauder’s Map💫',
                        url:"https://www.wizardingworld.com/writing-by-jk-rowling/the-marauders-map"
                    },
                ]
            ]
        }
    });
});

//questa funzione genera random le citazioni del libro
//salvate nel mio database
bot.onText(/\/quotes/,(msg)=>
{
    bot.sendMessage(msg.chat.id,"Looking for the best Harry Potter quotes that sum up the magic of the series🎇");
    let id=-1;
    let sql="SELECT id FROM citazioni";
    let array=[];
   
db.all(sql,[],(err,rows)=>
{
    if(err)
    {
        throw err;
    }
    rows.forEach((row)=>
    {
        var a=row;
        array.push(a["id"]);
        console.dir(row);
    }
    //dato che deve essere generato a caso, prima creo una query
    //per selezionare gli id 
    )
    var c=array[array.length-1]+1;
    //in questo while confronto un id generato in modo random con gli id 
    //presenti nella mia tabella
    //continua a eseguire il ciclo fino a quando non ne trova uno corrispondente
    while(!array.includes(id))
    { 
        id=getRandomIntInclusive(1,c);
    
    }
    //di conseguenza una volta trovato il mio id eseguo una seconda query per le informazioni che mi servono
    let sql2="SELECT citazioni.testo FROM citazioni WHERE id="+id;
    db.all(sql2,[],(err,rows)=>
    {
        if(err)
        {
            throw err;
        }
        rows.forEach((row)=>
        {
            var b=row;
            
            console.dir(row);
             bot.sendMessage(msg.chat.id,"⚡️"+b["testo"]+"⚡️");
            
        }
        )
       
    }
)
})
 }
)