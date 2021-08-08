const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: 'everyone'
})
require("dotenv").config()
require('discord-reply');
const { Database } = require("quickmongoconst db = new Database()const Database = require("@replit/database")");
const db = new Database(process.env.Mongo)
const randomstring = require("randomstring");
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const { MessageMenu, MessageMenuOption } = require('discord-buttons');
const config = require(`./config.json`)
const prefix = config.prefix;

async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(config.log_channel_id) || message.guild.channels.cache.find(channel => channel.name.match("log"));
  if (!ch) return console.log(`config.json`)
  ch.send(embed)
}

client.on('Pronto', async () => {
  await console.clear()
  channelLog(`> O bot esta conectando a API do discord.`)
  console.log(`Ticket `)
  console.log(`Sistema de ticket | HyzenShop`)
  console.log(`Compre agora!`)
  client.user.setActivity(config.status.name, { type: config.status.type.toUpperCase(), url: "https://discord.gg/SJn9jmdskE" })
});
client.on("message", async(message) =>{
  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift()
  if (command == prefix + `help`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Comandos do bot`)
      .setDescription(`> \`${prefix}enviar\` - Envie a mensagem para abrir o ticket
> \`${prefix}adicionar\` - Adicione certos membro ao ticket.
> \`${prefix}remover\` - Remover certos membro ao ticket..
> \`${prefix}deletar\` - Deleta o ticket.
> \`${prefix}fechar\` - Feche o ticket
> \`${prefix}abrir\` - Abrir um certo ticket
> \`${prefix}Renomear\` - Renomear certo ticket.
> \`${prefix}Setlog\` - Setar canais de logs
> \`${prefix}setstaff\` - Adicione um cargo staff para o ticket`)
      .setTimestamp()
      .setColor(`#33cd15`)
      .setFooter(`Ticket `)
    message.lineReply({ embed: embed })
  }
  if (command == prefix + `add`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mencione um membro de seu ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        }).then(() => {
          message.lineReply({ embed: { description: `${member} foi adicionado com sucesso a ${channel}`, color: `#33cd15` } });
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Uma pessoa foi adicionada a um ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Pessoa adicionado`, member.user)
            .addField(`Ação por`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        });
      }
      catch (e) {
        return message.channel.send(`Ocorreu um erro. Por favor, tente novamente!`);
      }
    }
  }
  if (command == prefix + `remover`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: Esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: false,
        }).then(() => {
           let log_embed = new Discord.MessageEmbed()
            .setTitle(`Pessoas removidas do ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`pessoa adicionada`, member.user)
            .addField(`ação por`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          message.lineReply({ embed: { description: `Exclua com sucesso ${member} a partir de ${channel}`, color: `#33cd15` } });
        });
      }
      catch (e) {
        return message.channel.send(`Ocorreu um erro. Por favor, tente novamente!`);
      }
    }
  }
  if (command == prefix + 'deletar') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: Esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      message.lineReply({ embed: { description: `Seu pedido foi executado após 5 segundos e será fechado.`, color: `#33cd15` } })
      setTimeout(async () => {
        let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket deletado`)
            .addField(`Numero do ticket`, `${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
            .addField(`Ticket do`,`<@!${await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by}>`)
            .addField(`ação por`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          channel.delete()
      }, 5000)
    }
  }
  if (command == prefix + 'fechar') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: Esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Seu pedido é executado após 5 segundos e será fechado`, color: `#33cd15` } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `O ticket foi fechado por <@!${message.author.id}>`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${(await db.get(`ticket_${channel.id}_${message.guild.id}`))}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket fechado`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`ação por`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`YELLOW`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`Ocorreu um erro. Por favor, tente novamente!`);
        }
      }, 1000)
    }
  }

  if (command == prefix + 'abrir') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Seu pedido é executado após 5 segundos`, color: `#33cd15` } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket abriu de <@!${message.author.id}>`, color: `GREEN` } })
          let meember = client.users.cache.get(await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Admin`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Moder`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`ticket-${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket re-abriu`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Ação por`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`Ocorreu um erro, tente novamente!`);
        }
      }, 1000)
    }
  }
  if (command == prefix + 'renomear' || command == prefix + 'setname') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: esse comando precisa de \`MANAGE_MESSAGES\` permissão.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `este servidor precisa configurar suas funções de equipe primeiro! \`{prefix}setstaff\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let args = message.content.split(' ').slice(1).join(' ');
      if (!args) return message.lineReply({ embed: { description: `Selecione o nome que deseja para o ticket`, color: `#33cd15` } })
      channel.setName(args)
      message.delete()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`Mudança de nome do Ticket`)
        .addField(`Novo nome`, args)
        .addField(`Ticket`, `<#${channel.id}>`)
        .addField(`de`, `<@!${message.author.id}>`)
        .setTimestamp()
        .setColor(`#33cd15`)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
    }
  }
  if (command == prefix + 'setstaff'){
    console.log(args)
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: esse comando precisa de\`ADMINISTRATOR\` permissão.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Forneça um ID de função de administrador, * e * um id de função de Mod com este comando! `, color: `#33cd15` } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Por favor, mencione uma função Admin (ou iD) primeiro, * depois * uma função Mod (ou iD) com este comando! `, color: `#33cd15` } })
    const Admin = message.guild.roles.cache.get(args[0]);
    const Moder = message.guild.roles.cache.get(args[1]);
    await db.set(`Staff_${message.guild.id}.Admin`, Admin.id)
    await db.set(`Staff_${message.guild.id}.Moder`, Moder.id)
    message.react("✅")
  }
  if (command == prefix + 'setcanal'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: esse comando precisa de \`ADMINISTRATOR\` permissão.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Por favor, mencione um canal, * então * um id com este comando! `, color: `#33cd15` } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Mencione um canal de registro (ou iD), * depois * uma categoria (ou iD) com este comando! `, color: `#33cd15` } })
    const txt = message.guild.channels.cache.get(args[0]);
    const cat = message.guild.channels.cache.get(args[1]);
    if (txt.type !== "text") return message.channel.send("A primeira entrada deve ser um canal de texto");
    if (cat.type !== "category") return message.channel.send("A segunda entrada deve ser uma categoria de texto");
    await db.set(`Channels_${message.guild.id}.Log`, txt.id)
    await db.set(`Channels_${message.guild.id}.Cat`, cat.id)
    message.react("✅")
  }
  if (command == prefix + 'enviar' || command == prefix + 'ticket') {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: Esse comando precisa de \`ADMINISTRATOR\` permissão.`);
    const sfats = await db.get(`Staff_${message.guild.id}`)
    const sfas = await db.get(`Channels_${message.guild.id}`)
    if (!sfats || sfats === null) return message.lineReply({ embed: { description: `Este servidor precisa configurar suas funções de equipe primeiro! \`${prefix}setstaff\``, color: `#33cd15` } })
    if (!sfas || sfas === null) return message.lineReply({ embed: { description: `Este servidor precisa configurar seus canais de tickets primeiro! \`${prefix}setcanal\``, color: `#33cd15` } })
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `Tickets`
    let button1 = new MessageMenuOption()
    .setLabel('Suporte especial')
    .setEmoji('🔴')
    .setValue("Opa")
    .setDescription('Use isto para contatar Admins + apenas!')
    let button3 = new MessageMenuOption()
    .setLabel('Pegue sua recompensa')
    .setEmoji('🎉')
    .setValue(":D")
    .setDescription('Use isso para entrar em contato com ajudantes e escalões superiores!')  
    let select = new MessageMenu()
    .setID(idd)
    .setPlaceholder('Criar um ticket!')
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(button1, button3)
    let embed = new Discord.MessageEmbed()
      .setTitle(args)
      .setDescription("Para criar um ticket, selecione uma das opções abaixo no menu.")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(`#33cd15`)
      .setFooter(message.guild.name, message.guild.iconURL())
    let msg = await message.channel.send({ embed: embed, component: select }).then(async msg => {
      msg.pin()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`Uma mensagem foi enviada para abrir novos tickets`)
        .addField(`Channel`, `<#${message.channel.id}>`)
        .addField(`de`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(`#33cd15`)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
      await db.set(`tickets_${idd}_${message.guild.id}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        options: [button1,  button3],
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }
})


client.on('Menu', async (button) => {
  console.log(button.values)
  if (await db.get(`tickets_${button.id}_${button.message.guild.id}`)) {
    await button.reply.send(`Seu ticket está sendo processado. Por favor, espere `, true)
    await db.math(`counts_${button.message.id}_${button.message.guild.id}`, `+`, 1)
    let count = await db.get(`counts_${button.message.id}_${button.message.guild.id}`)
    let channel;
    await button.clicker.fetch();
    if (button.values[0] === "Homens") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `Um Ticket : <@!${button.clicker.user.id}>`, reason: "Todos direitos reservados."
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Seu ticket foi aberto com sucesso** <#${channel.id}>`, true)
            let log_embed = new Discord.MessageEmbed()
              .setTitle(`Novo ticket aberto`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket de`, `<@!${button.clicker.user.id}>`)
              .addField(`Numero do ticket`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Suporte Especializado")
          .setFooter(`ticket aberto em`)
          .setColor(`#33cd15`)
          .setDescription(`O suporte estará com você em breve.\n
  To close this ticket, interact with 🔒`)
        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`fechar`)
          .setID(idd)
        channel.send(`bem-vindo <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
        if (button.values[0] === ":D"){ // help +
          button.guild.channels.create(`ticket-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `, Um ticket : <@!${button.clicker.user.id}>`, reason: "Todos direitos reservados"
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **Seu ticket foi aberto com sucesso** <#${channel.id}>`, true)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Novo ticket aberto`)
                  .addField(`Ticket`, `<#${channel.id}>`)
                  .addField(`Ticket de`, `<@!${button.clicker.user.id}>`)
                  .addField(`Numero de ticket`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)
                channelLog(log_embed)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("Reivindicar sua recompensa")
              .setFooter(`Ticket aberto em`)
              .setColor(`#33cd15`)
              .setDescription(`O suporte estará com você em breve.\n
      Para fechar este ticket, interagir com 🔒`)
            let idd = randomstring.generate({ length: 25 })
            await db.set(`close_${button.clicker.user.id}`, idd)
            let bu1tton = new disbut.MessageButton()
              .setStyle(`gray`)
              .setEmoji(`🔒`)
              .setLabel(`Fechar`)
              .setID(idd)
            channel.send(`Bem-vindo <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }
      }
    });
      client.on('Menu', async (button1) => {
        await button1.clicker.fetch()
        let idd = randomstring.generate({ length: 25 })
        await db.set(`close_${button1.clicker.user.id}_sure`, idd)
        if (button1.id == (await db.get(`close_${button1.clicker.user.id}`))) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`Fechar`)
            .setID(idd)
          await button1.reply.send(`Tem certeza que deseja fechar este ticket?`, { component: bu0tton, ephemeral: true });
        }
      })
        client.on('Botão', async (button) => {
          await button.clicker.fetch()
          if (button.id == (await db.get(`close_${button.clicker.user.id}_sure`))) {
          await button.reply.send(`Seu pedido é executado após 5 segundos e será fechado`, true)   
            let ch = button.channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `O ticket já foi fechado <@!${button.clicker.user.id}>`, color: `YELLOW` } });
                let type = 'membro'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`Ticket fechado`)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Ticket fechado`)
                  .addField(`Ticket`, `<#${ch.id}>`)
                  .addField(`ação de`, `<@!${button.clicker.user.id}>`)
                  .setTimestamp()
                  .setColor(`YELLOW`)
                channelLog(log_embed)
              } catch (e) {
                return button.channel.send(`Ocorreu um erro. Por favor, tente novamente!`);
              }
            }, 4000)
          }
        })
client.login(process.env.TOKEN);