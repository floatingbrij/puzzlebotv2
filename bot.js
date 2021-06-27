const Discord = require("discord.js");
require('discord-reply');
const client = new Discord.Client();
const mongoose = require('mongoose');
cooldown = 600000;
client.on("ready", () => {
    client.user.setActivity("Puzzles! Dm to start!", { type: "PLAYING"})
    });

mongodb_srv= `mongodb+srv://brij:brijisidiot@pizzlebotdata.2ihyg.mongodb.net/puzzelbotsdata?retryWrites=true&w=majority`;
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

mongoose.connect(mongodb_srv,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(()=>{
        console.log('Connected to db!');
    })
    .catch((err) =>{
        console.log(err);
    });
const profilem = require("./models/dbschema.js");
const lvlmap = require("./models/dblvl.js");
const gldb = require("./models/goldrush.js");
const { profile, time } = require("console");
const talkedRecently = new Set();
const dmdRecently = new Set();
let cldown = 600000;
var check1 = false;
var check2 = 0;
client.on("message",async function(message)
{
  if(message.author.bot) return;
  if(message.guild !=null) return;
  puzzelguild = client.guilds.cache.get(`777607607019110479`);
  if(puzzelguild.members.cache.get(`${message.author.id}`) === undefined) return;
  userdata = await profilem.findOne({userid: message.author.id});
  anstothislevel = ``;
  if(userdata)
  {
    console.log(userdata.level)
    const hii =await lvlmap.findOne({lvl: userdata.level});
    if(!hii)
    {
      return;
    }
    anstothislevel = hii.lvlans;
    console.log(anstothislevel)
  }
  if(!userdata)
  { 	if (talkedRecently.has(message.author.id)) return;

		if(!client.guilds.cache.get(`777607607019110479`).members.cache.get(message.author.id).roles.cache.has(`829402829705052230`)) 
        {
        const succ = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Hello Puzzler!`)
		.setDescription(`Welcome to the Puzzle event <@${message.author.id}>! The event will be starting on 29th June!`)
		.setThumbnail(`https://i.ibb.co/8K1qyMy/a-a5f0cb79db926271b88ce50524dd4319-1.gif`)
		.setFooter(`Stay in the server for more updates!`)
	    message.author.send(succ)
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, 600000);
        return;
        }
     else {
    let newuser = await profilem.create({
      userid: message.author.id,
      level: 1
    })

    newuser.save();
    role = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level 1`);

    client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.add(role.id);
    const succ = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Hello Puzzler!`)
      .setDescription(`Welcome to the first level of The Puzzle!\nGo ahead to [Level 1](https://discord.com/channels/777607607019110479/829400116758183986)  and start solving!\n\n**Upon solving, dm me the answer to level up!**`)
      .setThumbnail(`https://i.ibb.co/8K1qyMy/a-a5f0cb79db926271b88ce50524dd4319-1.gif`)
    message.author.send(succ);

    const lvllog = new Discord.MessageEmbed()
      .setColor(`#0099ff`)
      .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription(`<@${message.author.id}> has joined the puzzle!`)
    client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
return;
}
  }
  else if(message.content === `+level`)
  {
    const lvl1 = await lvlmap.findOne({lvl: userdata.level});
    const levelembed = new Discord.MessageEmbed()
      .setColor(`#0f0f0f`)
      .setTitle(`You're in level ${userdata.level}`)
      .setDescription(`[Level ${userdata.level} link](https://discord.com/channels/777607607019110479/${lvl1.lvlid})`)
    message.author.send(levelembed);
    return;
  }
  if(check1 === true)
  {
    if(check2 === 0) return;
    ques = check2;
    const answer = await gldb.findOne({lvl:ques});
    if(message.content === answer.lvlans)
    {
      message.author.send(`Congratulations! You have won this round of Gold Rush!`)
      check1 = false;
	const solved = new Discord.MessageEmbed()
        .setColor(`#FFD700`)
        .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(`<@${message.author.id}> has won a Gold Rush!`)

        client.guilds.cache.get(`777607607019110479`).channels.cache.get(`832476253284991006`).send(solved);
      //need to message everyone else
      let users = client.guilds.cache.get(`777607607019110479`).roles.cache.get(`856350943092015114`).members.map(m=>m.user.id);
      for(x in users)
      {
        if(users[x]!=message.author.id){
          client.guilds.cache.get(`777607607019110479`).members.cache.get(users[x]).send(`Someone else has already finished it! too late!`);
      }
      }

      return;
    }
    
  }
  else if(message.content === anstothislevel && anstothislevel === `kenya`)
  {
    message.lineReply(`Kenya sugondeez nuts `);
  }
  if(message.content === anstothislevel)
  {
    console.log(`Hi im here ${message.content}: ${anstothislevel}`)
    let levelplus = userdata.level+1;
    const profileup = await profilem.findOneAndUpdate({
      userid: message.author.id,
    },
    {
      $set: {
          level: levelplus,
      },
    });
    if(levelplus===16) //maxlevel
    {
      client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.remove(`849571441925423124`);
      client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.add(`848561287410876427`)
      message.author.send(`Congratulations! You have completed the Puzzel!`)
      client.guilds.cache.get(`777607607019110479`).channels.cache.get(`831428870719930380`).send(`<@${message.author.id}> has completed the Puzzle!`);
      const lvllog = new Discord.MessageEmbed()
        .setColor(`#0099ff`)
        .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(`<@${message.author.id}> has completed the Puzzle!`)
      client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
    }

    else {
      const lvl1 = await lvlmap.findOne({lvl: levelplus});
      const help = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Congratulations! you have successfully solved level ${levelplus-1}!`)
        .setDescription(`Next level: [Level ${levelplus}](https://discord.com/channels/777607607019110479/${lvl1.lvlid})`)
      message.author.send(help);
      removerole = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${levelplus-1}`);
      addrole = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${levelplus}`);
      client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.remove(removerole.id);
      client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.add(addrole.id);
      const lvllog = new Discord.MessageEmbed()
        .setColor(`#0099ff`)
        .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(`<@${message.author.id}> has solved level ${levelplus-1}!`)
      client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);

    }
  }
  else {
    message.react(`❌`)
	  .catch(console.log);
  }

})
wordlist = ["faggot","negroid","nigger","nigga","tranny","trannies","chink","nibba","retard","retarded","fag","trannie","nibber","nibbers","177013","kekma.net","niqqa","niqqer","nigward",'黑鬼'];

client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(!message.member.roles.cache.find(role=>role.name===`Puzzle Moderator`)) return;
  if(message.content.startsWith(`+set`) && !(message.member.hasPermission("ADMINISTRATOR")))
  {
	  message.lineReply("You are missing `administrator` perms to run this command.");
  }

  if(message.content.startsWith(`+set`) && (message.member.hasPermission("ADMINISTRATOR")))
  {
    let splitmessage = message.content.split(` `);
    splitmessage.splice(0,1);
    if(splitmessage.length === 0)
    {
      message.lineReply('mention user & level please.')
      return;
    }
    userid11 = splitmessage[0];
    userid11 = userid11.replace(/\D/g,'');
    if(userid11 === undefined || userid11 === null || userid11 === `` || Number(userid11)<11111111111111111)
    {
      userid11 = splitmessage[0];
      const user1 = client.users.cache.find(user => user.tag.toLowerCase().startsWith(userid11.toLowerCase())).id;
      userid11 = user1;
    }
    lvl = splitmessage[1];
    lvlnum = Number(lvl)
    if(message.guild.members.cache.get(userid11).user.bot){
      message.lineReply(`You can't add bots to the db.`);
      return;
    }
    if(client.guilds.cache.get(`777607607019110479`).members.cache.has(userid11))
    {
      if(lvlnum>=0 && lvlnum<=15) //maxlevel
      {
        userdata = await profilem.findOne({userid: userid11});
        if(!userdata)
        {
          let newuser = await profilem.create({
            userid: userid11,
            level: lvlnum
          })

          newuser.save();
          role = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${lvlnum}`);
          client.guilds.cache.get(`777607607019110479`).members.cache.get(`${userid11}`).roles.add(role.id);
          message.lineReply(`User successfully set. (${userid11} : ${lvlnum})`)
          const lvllog = new Discord.MessageEmbed()
          .setColor(`#0099ff`)
          .setAuthor(`${message.guild.members.cache.get(userid11).user.tag}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
          .setDescription(`<@${userid11}> has been set to level ${lvlnum} by <@${message.author.id}>`)
          client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
        }
        else {
          const profileup = await profilem.findOneAndUpdate({
            userid: userid11,
          },
          {
            $set: {
                level: lvlnum,
            },
          });
          removerole = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${userdata.level}`);
          addrole = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${lvlnum}`);
          client.guilds.cache.get(`777607607019110479`).members.cache.get(`${userid11}`).roles.remove(removerole.id);
          client.guilds.cache.get(`777607607019110479`).members.cache.get(`${userid11}`).roles.add(addrole.id);
          message.lineReply(`User successfully set. (${userid11} : ${lvlnum})`)
          const lvllog = new Discord.MessageEmbed()
            .setColor(`#0099ff`)
            .setAuthor(`${message.guild.members.cache.get(userid11).user.tag}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`<@${userid11}> has been set to level ${lvlnum} from level ${userdata.level} by <@${message.author.id}>`)
          client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
        }
      }
      else {
        message.lineReply(`only level 0 to level 15`) //maxlevel
      }
    }
    else {
      message.lineReply(`User not in server`)
    }
  }
  if(message.content.startsWith(`+del`) && !(message.member.hasPermission("ADMINISTRATOR")))
  {
	  message.lineReply("You are missing `administrator` perms to run this command.");
  }

  if(message.content.startsWith(`+del`) && message.member.hasPermission("ADMINISTRATOR"))
  {
    let splitmessage = message.content.split(` `);
    let userid11 = splitmessage[1];
    userid11 = userid11.replace(/\D/g,'');
    if(userid11 === undefined || userid11 === null || userid11 === `` || Number(userid11)<11111111111111111)
    {
      userid11 = splitmessage[1];
      const user1 = client.users.cache.find(user => user.tag.toLowerCase().startsWith(userid11.toLowerCase())).id;


      userid11 = user1;
    }
    if(message.guild.members.cache.get(userid11).user.bot){
      message.lineReply(`You can't dm bots.`);
      return;
    }
    userdata = await profilem.findOne({userid: userid11});
    if(!userdata)
    {
      message.lineReply(`User not in db`)
      return;
    }
    else {
      profilem.findOneAndDelete({userid: userid11}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted User : ", docs);
    }
});

    removerole = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level ${userdata.level}`);
    client.guilds.cache.get(`777607607019110479`).members.cache.get(`${userid11}`).roles.remove(removerole.id);
    message.lineReply(`User ${userid11} successfully deleted.`)
    const lvllog = new Discord.MessageEmbed()
    .setColor(`#0099ff`)
    .setAuthor(`${message.guild.members.cache.get(userid11).user.tag}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setDescription(`<@${userid11}> has been deleted from the db by <@${message.author.id}>`)
    client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
    }
  }

})
client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild !=null) return;
  let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null
  if(messageAttachment)
  {
      const oopsie = new Discord.MessageEmbed()
          .setColor(`#ba5555`)
          .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
          .setTitle(`Message Sent:`)
          .setDescription(`${message.content} \n Attachment:${messageAttachment}`)
          .setImage(messageAttachment)
          .setTimestamp(message.createdAt)
	        .setFooter(`ID: ${message.author.id}`);
  client.guilds.cache.get(`777607607019110479`).channels.cache.get('832673765854806116').send(oopsie);

  }
  else{
      const oopsie = new Discord.MessageEmbed()
          .setColor(`#ba5555`)
          .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
          .setTitle(`Message Sent:`)
          .setDescription(`${message.content}`)
          .setTimestamp(message.createdAt)
	        .setFooter(`ID: ${message.author.id}`);

  client.guilds.cache.get(`777607607019110479`).channels.cache.get('832673765854806116').send(oopsie);

  }

})

client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(!message.member.roles.cache.find(role=>role.name===`Puzzle Moderator`) && !message.member.roles.cache.find(role=>role.name===`Sponsor`) ) return;
  if(message.content === `aple`)
  {
    message.lineReply('aple')
  }
  if(message.content === `good bot`)
  {
    message.lineReply('thankyou  🥰')
  }
  if(message.content.startsWith(`+dm`))
  {
  for(var x = 0;x<wordlist.length;x++)
  { 
    if ((dmdRecently.has(message.author.id))&&!(message.member.hasPermission("ADMINISTRATOR"))) {
        message.lineReply(`Wait a while lol`)
        .then(msg => {
            setTimeout(() => msg.delete(), 10000)
          })
        return;
    } 
    if(message.content.includes(wordlist[x]))
    {
    message.lineReply(`No bad words bud!`);
    console.log(`${message.member.tag} sent ${wordlist[x]}`)
    return;
    }
   }
    splitmessage=message.content.split(` `);
    splitmessage.splice(0,1);
    console.log(splitmessage);
    if(splitmessage.length === 0){
      message.lineReply(`Who da fuck do I dm buddy`)
      return;
    }
    if(splitmessage[0] === `inrole` && message.member.hasPermission("ADMINISTRATOR"))
    {
      roleid = splitmessage[1].match(/\d+/g);
      roled =  message.guild.roles.cache.get(`${roleid}`) || await message.guild.roles.fetch(`${roleid}`);
      
      if(!roled) return message.lineReply(`No such role`);
      users = roled.members.map(m=>m.user.id);
      console.log(users);
      
      splitmessage.splice(0,2);
      msg = splitmessage.join(` `);
      for(x in users)
      { 
        
        message.guild.members.cache.get(users[x]).send(msg);
        if (message.attachments.size > 0) {
          message.attachments.forEach(Attachment => {
              message.guild.members.cache.get(users[x]).send(Attachment.url);
          })
        }
        
      }
      message.lineReply(`Done ✅`);
      return;
    }
    userid11 = splitmessage[0];
    userid11 = userid11.replace(/\D/g,'');
    if(userid11 === undefined || userid11 === null || userid11 === `` || Number(userid11)<11111111111111111)
    {
      userid11 = splitmessage[0];
      const user1 = client.users.cache.find(user => user.tag.toLowerCase().startsWith(userid11.toLowerCase())).id;

      userid11 = user1;
    }
    if(message.guild.members.cache.get(userid11).user.bot){
      message.lineReply(`You can't dm bots.`);
      return;
    }
    if(message.guild.members.cache.get(userid11) === undefined)
    {
      message.lineReply(`Either ${userid11} isn't a valid id or that user might not be in the server.`)
      return;
    }
    splitmessage.splice(0,1);
    msg = splitmessage.join(" ");
    if(splitmessage.length === 0 && message.attachments.size === 0)
    {
      message.lineReply(`I can't send empty messages smh.`);
      return;
    }
    tagg = message.guild.members.cache.get(userid11).user.tag;
    idd = message.guild.members.cache.get(userid11).user.id;
    message.guild.members.cache.get(userid11).send(msg).catch(()=>message.lineReply(`That user probably has dms **off**!!`))
    .then(()=>{
      if (message.attachments.size > 0) {
        message.attachments.forEach(Attachment => {
            message.guild.members.cache.get(userid11).send(Attachment.url);
        })
      }
    })
    .then(()=>message.lineReply(`dm'd the given user(${tagg}: ${idd}).`))
    .then(()=>{
        if(message.member.hasPermission("ADMINISTRATOR")) return;
        dmdRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          dmdRecently.delete(message.author.id);
        }, cldown);
    })


  }

})
client.on("message",async function(message)
{
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(!message.member.hasPermission("ADMINISTRATOR")) return;

  if(message.content.startsWith(`+smd`))
  {
      hmm = message.content.split(` `);
    
      if(!hmm[1] || !isNaN(hmm[1]))
      {
          if(hmm[1]>60) return message.lineReply(`Too much time.`);
          if(hmm[1]<0) return message.lineReply(`Don't break me thx`);
          cldown = 60000*Number(hmm[1])
          .then(()=>
          {
              message.lineReply(`Cooldown set to ${hmm[1]} minutes`);
          })
      }
  }
  if(message.content.startsWith(`+h`))
  {
    let splitMessage = message.content.split(` `);
      splitMessage.splice(0,1);
      if(splitMessage=== null)
      {

      }
      else
      {
        if(message.reference != null)
        {
          replymsg = message.reference.messageID;

          hmm =await message.channel.messages.fetch(replymsg);

          await hmm.lineReply(splitMessage.join(" "));
          message.delete()
          return;
        }
        message.channel.send(splitMessage.join(" "));
        message.delete();
      }
  }
  if(message.content.startsWith(`+br`))
  {
    splitmessage = message.content.split(` `)
    check2 = Number(splitmessage[1]);

    const anscheck = await gldb.findOne({lvl:check2})
    if(!anscheck)
    {
      message.lineReply(`No such level`)
      return;
    }
    else {
      check1 = true;
      message.lineReply(`Gold rush has started with \nQ:\`${anscheck.lvlq}\`\nAns:\`${anscheck.lvlans}\``)
      let users = message.guild.roles.cache.get(`856350943092015114`).members.map(m=>m.user.id);
      for(x in users)
      {
        message.guild.members.cache.get(users[x]).send(`GOLD RUSH TIME!!!!! YOU HAVE 30 SECONDS TO ANSWER THIS QUESTION:\n\nQ:`);
        message.guild.members.cache.get(users[x]).send(`${anscheck.lvlq}`)
      }
    }
    setTimeout(()=>{
      if(check1 === true)
      {
        check1 = false;
        check2 = 0;
        let users = message.guild.roles.cache.get(`856350943092015114`).members.map(m=>m.user.id);
        for(x in users)
        {
          message.guild.members.cache.get(users[x]).send(`Gold rush has ended! No one won lmao!`);
        }
        message.lineReply(`Gold rush has ended, check <#832476253284991006> to see if someone won!`)
      }
    },30000)
  }
  if(message.content.startsWith(`+gldelete`))
  {
    splitmessage = message.content.split(` `);
    hmm = await gldb.findOne({lvl:splitmessage[1]})
    if(!hmm)
    {
      message.lineReply(`No such question.`)
      return;
    }
    else {
      gldb.findOneAndDelete({lvl:splitmessage[1]}).then(()=>{
        message.lineReply(`Gl level deleted.`)
      }).catch(console.log)
    }
  }
  if(message.content.startsWith(`+glview`))
  {
    hmm = await gldb.find({}).sort({lvl: 1});

    const embeddd =new Discord.MessageEmbed()
      .setColor(`#0f0f0f`)
      .setTitle(`Gold Rush Q & Ans`)
    for(x in hmm)
    {
      embeddd.addField(`\n${hmm[x].lvl}. ${hmm[x].lvlq}`,`||${hmm[x].lvlans}||`)
    }
    message.lineReply(embeddd)
  }
  if(message.content.startsWith(`+glset`))
  {

    splitmessage = message.content.split(` `)

    splitquesans = message.content.split(/[""]/)
    for(x in splitquesans)
    {
      if(splitquesans[x]===` `||splitquesans[x]===``)
      {
        splitquesans.splice(x,1);
      }
    }
    splitquesans.splice(0,1);
    if(splitquesans.length !=2)
    {
      message.lineReply(`Give both level and answer.`)
      return;
    }
    glques = splitquesans[0];
    glans = splitquesans[1];
    gllevelnum = splitmessage[1];
    gllvl = await gldb.findOne({lvl: gllevelnum})
    if(!gllvl)
    {
      let newgllvl = await gldb.create({
        lvlq: glques,
        lvlans: glans,
        lvl: gllevelnum
      })
        newgllvl.save().then(()=>{
        message.lineReply("Set Gold rush level "+gllevelnum+"\nQ:`"+glques+"`\nAns:`"+glans+"`")
      })
    }
    else{
      let updategllvl = await gldb.findOneAndUpdate({
        lvl: gllevelnum,
      },
      {
        $set: {
          lvlq: glques,
          lvl: gllevelnum,
          lvlans: glans,
        },
      }
    ).then(()=>{
      message.lineReply("Gold rush level "+gllevelnum+" updated.\nQ:`"+glques+"`\nAns:`"+glans+"`")
    })

    }
  }
  if(message.content.startsWith(`+lvlset`))
  {
    let splitmessage = message.content.split(` `);
    splitmessage.splice(0,1);
    if(splitmessage.length === 0) return message.lineReply(`Dude wtf`);
    levelid = splitmessage[0];
    lvlonlyid = levelid.replace(/\D/g,'');
    if(!message.guild.channels.cache.has(lvlonlyid)){
      message.lineReply('No such level.');
      return;
    }
    levelnumber = message.guild.channels.cache.get(lvlonlyid).name;
    lvlnumber = levelnumber.replace(/\D/g,'');
    console.log(`${levelnumber} and ${lvlnumber}`)
    if(Number(lvlnumber)<0 || Number(lvlnumber)>15 || lvlnumber === "")
    {
      message.lineReply(`That level doesn't look like a puzzle level.`)
      return;
    }
    splitmessage.splice(0,1);
    if(splitmessage.length=== 0){
      message.lineReply(`where answer buddy.`)
    }
    answer = splitmessage.join(` `);

    lvldata = await lvlmap.findOne({lvlid: lvlonlyid});

    if(!lvldata)
    {
      let newlvl = await lvlmap.create({
        lvlid: lvlonlyid,
        lvl: Number(lvlnumber),
        lvlans: answer
      })

      newlvl.save().then(()=>message.lineReply(`Successfully set new puzzle level ${lvlnumber}(<#${lvlonlyid}>): ${answer}`)).catch(()=>message.lineReply(`Unable to set db.`))
    }
    else{
      const lvlupdate = await lvlmap.findOneAndUpdate({
        lvlid: lvlonlyid,
      },
      {
        $set: {
          lvlid: lvlonlyid,
          lvl: Number(lvlnumber),
          lvlans: answer,
        },
      }).then(()=>message.lineReply(`Successfully set puzzle level ${lvlnumber}(<#${lvlonlyid}>): ${answer}`)).catch(()=>message.lineReply(`Unable to set db.`))

    }
  }
  if(message.content.startsWith(`+lvldel`))
  {
    let splitmessage = message.content.split(` `);
    splitmessage.splice(0,1);
    levelid = splitmessage[0];
    lvlonlyid = levelid.replace(/\D/g,'');
    if(!message.guild.channels.cache.has(lvlonlyid)){
      message.lineReply('No such level.');
      return;
    }
    levelnumber = message.guild.channels.cache.get(lvlonlyid).name;
    lvlnumber = levelnumber.replace(/\D/g,'');
    if(Number(lvlnumber)<0 || Number(lvlnumber)>15 || lvlnumber ==="")
    {
      message.lineReply(`That level doesn't look like a puzzle level.`)
      return;
    }
    lvldata = await lvlmap.findOne({lvlid: lvlonlyid});
    if(!lvldata)
    {
      message.lineReply(`No such level in db`);
      return;
    }
    else {
      lvlmap.findOneAndDelete({lvlid: lvlonlyid}, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted level : ", docs);
    }
}).then(()=>message.lineReply(`Successfully deleted <#${lvlonlyid}> from db.`)).catch(()=>message.lineReply(`Unable to delete level from db`))
    }

  }
  if(message.content === `+lvlans`)
  {

    str = ``;

    profileall = await lvlmap.find({}).sort({lvl: 1});
    for(x in profileall)
    {
      lvl1 = 1+Number(x);
      str = str+ `\n${lvl1}. Level ${profileall[x].lvl} <#${profileall[x].lvlid}>: ${profileall[x].lvlans}`;
    }
    if(str === ``)
    {
      message.lineReply(`Error with db`);
    }
    else{
      const lvl1 = new Discord.MessageEmbed()
        .setColor(`#0f0f0f`)
        .setTitle(`Level Answers:`)
        .setDescription(str)
      message.lineReply(lvl1)
    }
  }

})

client.on(`message`,async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(message.content === `+help` && (message.member.roles.cache.has(`845971016341782548`)||message.member.roles.cache.has(`829404741385060402`)))
  {
    str = "1. `+dm <userid/mention> message` - Obviously to dm someone =)\n2. `+help` - You're looking at it."
    if(message.member.hasPermission("ADMINISTRATOR"))
  {

    str = "1. `+set <userid/usermention> <lvlnumber>` - Works for both updating person's level & also to make new entry in db\n2. `+del <userid/usermention>` - Deletes user from db and removes their role.\n3. `+dm <userid/mention> message` - Obviously to dm someone =)"
    str = str + "\n4. `+lvlset [#lvl] [answer]` - to set levels(both update & create)\n5. `+lvldel [#lvl]` - to delete levels \n6. `+lvlans` - to see levels & answers in db"
  }
    const dbhelp = new Discord.MessageEmbed()
      .setColor(`#0f0f0f`)
      .setTitle(`Mod commands:`)
      .setDescription(str)
      message.lineReply(dbhelp)
  }
})
client.on(`message`,async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(message.author.id != `484692654731427843`) return;

    if (message.content.toLowerCase() == "+shutdown") { // Note that this is an example and anyone can use this command.
        message.channel.send("Shutting down...").then(() => {
            client.destroy();
	
        })
    }

  if(message.content === `+uchnl`)
  {
    str = false;
    for(var i=0; i<=30 ; i++)
    {
      chnl = message.guild.channels.cache.find(channel=>channel.name === `level-${i}`);
      rle = message.guild.roles.cache.find(r=>r.name.toLowerCase() === `Level ${i}`.toLowerCase());
      chnl.updateOverwrite(message.guild.roles.cache.get(rle.id), { VIEW_CHANNEL: true });
      console.log(chnl.id + ` `+ chnl.name);
      console.log(rle.id+ ` `+ rle.name)
    }
  }
})
client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;

  if(!message.member.roles.cache.find(role=>role.name===`Puzzle Moderator`) && !message.member.hasPermission("ADMINISTRATOR")) return;
  if(message.content.startsWith(`+lb`))
  {
    str = ``;
    let splitmessage = message.content.split(` `);
    num = 5;
    numcheck = parseInt(splitmessage[1]);
    if(numcheck>0 && numcheck<21)
    {
	    num = numcheck;
    }
    profileall = await profilem.find({}).sort({level: -1}).limit(num);
    for(x in profileall)
    {
      lvl1 = 1+Number(x);
      if(profileall[x].level>15)
      {
        str = str+ `\n${lvl1}. <@${profileall[x].userid}> has finished the puzzle!`;
      }
      else{
      str = str+ `\n${lvl1}. <@${profileall[x].userid}> is on level ${profileall[x].level}`;
      }
    }
    if(str === ``)
    {
      message.lineReply(`Error with db`);
    }
    else{
      const lvl1 = new Discord.MessageEmbed()
        .setColor(`#0f0f0f`)
        .setTitle(`Leaderboard(top ${num}):`)
        .setDescription(str)
      message.lineReply(lvl1)
    }
  }

})

client.login(`ODMyMjA0MjY5NDM1NzQ4MzUz.YHgYnw.MwMi-8Rq9D3QbgkcmLQ_TWc8iUY`)

