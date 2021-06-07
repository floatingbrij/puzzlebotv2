const Discord = require("discord.js");
require('discord-reply');
const client = new Discord.Client();
const mongoose = require('mongoose');
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
const { profile } = require("console");

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
      client.guilds.cache.get(`777607607019110479`).channels.cache.get(`832673765854806116`).send(`<@484692654731427843> level ${userdata.level} has no answer`)
      return;
    }
    anstothislevel = hii.lvlans;
    console.log(anstothislevel)
  }
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
      .setDescription(`[Level ${userdata.level} link](https://discord.com/channels/777607607019110479/${userdata.levelid})`)
    message.author.send(levelembed);
  }
  else if(message.content === anstothislevel)
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
    if(message.content.includes(wordlist[x]))
    {
    message.lineReply(`No bad words bud!`);
    console.log(`${message.member.tag} sent ${wordlist[x]}`)
    return;
    }
   }
    splitmessage=message.content.split(` `);
    splitmessage.splice(0,1);
    if(splitmessage.length === 0){
      message.lineReply(`Who da fuck do I dm buddy`)
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
    if(splitmessage.length === 0)
    {
      message.lineReply(`I can't send empty messages smh.`);
      return;
    }
    tagg = message.guild.members.cache.get(userid11).user.tag;
    idd = message.guild.members.cache.get(userid11).user.id;
    message.guild.members.cache.get(userid11).send(msg).catch(()=>message.lineReply(`That user probably has dms **off**!!`)).then(()=>message.lineReply(`dm'd the given user(${tagg}: ${idd}).`))


  }
  
})
client.on("message",async function(message){
  if(message.author.bot) return;
  if(message.guild === null) return;
  if(!message.member.hasPermission("ADMINISTRATOR")) return;
  if(message.content.startsWith(`+lvlset`))
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
