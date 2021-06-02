const Discord = require("discord.js");
require('discord-reply');
const client = new Discord.Client();
const mongoose = require('mongoose');
let lvlinfo = ["829399994384777228","829400116758183986","829400127420629053","829400137041707009","829400147426934794"];//maxlevel
let lvlans = ["dude","second","third","firth"];//maxlevel
client.on("ready", () => {
    client.user.setActivity("Puzzels! Dm to start!", { type: "PLAYING"})
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


client.on("message",async function(message)
{
  if(message.author.bot) return;
  if(message.guild !=null) return;
  puzzelguild = client.guilds.cache.get(`777607607019110479`);
  if(puzzelguild.members.cache.get(`${message.author.id}`) === undefined) return;
  userdata = await profilem.findOne({userid: message.author.id});
  if(!userdata)
  {
    let newuser = await profilem.create({
      userid: message.author.id,
      level: 0
    })

    newuser.save();
    role = client.guilds.cache.get(`777607607019110479`).roles.cache.find(role=>role.name === `Level 0`);

    client.guilds.cache.get(`777607607019110479`).members.cache.get(`${message.author.id}`).roles.add(role.id);
    const succ = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Hello Puzzler!`)
      .setDescription(`Welcome to the first level of The Puzzle!\nGo ahead to [Level 0](https://discord.com/channels/777607607019110479/${lvlinfo[0]})  and start solving!\n\n**Upon solving, dm me the answer to level up!**`)
      .setThumbnail(`https://i.ibb.co/8K1qyMy/a-a5f0cb79db926271b88ce50524dd4319-1.gif`)
    message.author.send(succ);

    const lvllog = new Discord.MessageEmbed()
      .setColor(`#0099ff`)
      .setAuthor(`${message.author.tag}`,message.author.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription(`<@${message.author.id}> has joined the puzzle!`)
    client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
  }
  else if(message.content === `+level`)
  {
    const levelembed = new Discord.MessageEmbed()
      .setColor(`#0f0f0f`)
      .setTitle(`You're in level ${userdata.level}`)
      .setDescription(`[Level ${userdata.level} link](https://discord.com/channels/777607607019110479/${lvlinfo[userdata.level]})`)
    message.author.send(levelembed);
  }
  else if(message.content === lvlans[userdata.level])
  {
    let levelplus = userdata.level+1;
    const profileup = await profilem.findOneAndUpdate({
      userid: message.author.id,
    },
    {
      $set: {
          level: levelplus,
      },
    });
    if(levelplus>15) //maxlevel
    {
      message.author.send(`Congratulations! You have completed the Puzzel!`)
    }
    else {
      const help = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Congratulations! you have successfully solved level ${levelplus-1}!`)
        .setDescription(`Next level: [Level ${levelplus}](https://discord.com/channels/777607607019110479/${lvlinfo[levelplus]})`)
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
    message.author.send("Wrong answer buddy");
  }

})

client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(!message.member.roles.cache.find(role=>role.name===`Puzzle Moderator`)) return;
  if(message.content.startsWith(`+set`))
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
    lvl = splitmessage[1];
    lvlnum = Number(lvl)
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
          setColor(`#0099ff`)
          .setAuthor(`${userid11}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
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
            .setAuthor(`${userid11}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
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
  if(message.content.startsWith(`+del`))
  {
    let splitmessage = message.content.split(` `);
    let userid11 = splitmessage[1];
    userid11 = userid11.replace(/\D/g,'');
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
    setColor(`#0099ff`)
    .setAuthor(`${userid11}`,message.guild.members.cache.get(userid11).user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setDescription(`<@${userid11}> has been deleted from the db by <@${message.author.id}>`)
    client.guilds.cache.get(`777607607019110479`).channels.cache.get('832476253284991006').send(lvllog);
    }
  }
  if(message.content === `+help`)
  {
    const dbhelp = new Discord.MessageEmbed()
      .setColor(`#0f0f0f`)
      .setTitle(`Mod commands:`)
      .setDescription("1. `+set <userid/usermention> <lvlnumber>` - Works for both updating person's level & also to make new entry in db\n2. `+del <userid/usermention>` - Deletes user from db and removes their role.")
      message.lineReply(dbhelp)
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
  if(!message.member.roles.cache.find(role=>role.name===`Puzzle Moderator`)) return;
  if(message.content === `aple`)
  {
    message.lineReply('aple')
  }
  if(message.content.startsWith(`-dm`))
  {
    splitmessage=message.content.split(` `);
    splitmessage.splice(0,1);
    if(splitmessage.length === 0){
      message.lineReply(`Who da fuck do I dm buddy`)
      return;
    }
    userid11 = splitmessage[0];
    userid11 = userid11.replace(/\D/g,'');
    if(message.guild.members.cache.get(userid11) === undefined)
    {
      message.lineReply(`Either ${userid11} isn't a valid id or that user might not be in the server.`)
      return;
    }
    splitmessage.splice(0,1);
    msg = splitmessage.join(" ");
    if(splitmessage.length === 0)
    {
      message.lineReply(`I can't send empty messages smh.`);
      return;
    }
    message.guild.members.cache.get(userid11).send(msg).catch(()=>message.lineReply(`That user probably has dms **off**!!`)).then(()=>message.lineReply(`Successfully dm'd the given user.`))


  }
})

client.login(`ODMyMjA0MjY5NDM1NzQ4MzUz.YHgYnw.MwMi-8Rq9D3QbgkcmLQ_TWc8iUY`)
