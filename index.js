const { Client, Intents, MessageEmbed } = require('discord.js');
const token = ''; // Replace 'YOUR_BOT_TOKEN' with your actual bot token

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

client.once('ready', () => {
  console.log('Bot is online!');
  client.user.setActivity('Luna', { type: 'LISTENING' });
});

client.on('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;

  const args = message.content.slice('!'.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'kick':
      if (!message.member.permissions.has('KICK_MEMBERS')) {
        return message.reply('You do not have permissions to kick members.');
      }
      const member = message.mentions.members.first();
      if (member) {
        member.kick().then(() => {
          message.channel.send(`${member.displayName} was kicked.`);
        }).catch(err => {
          message.channel.send('I was unable to kick the member.');
          console.error(err);
        });
      } else {
        message.channel.send('Please mention a valid member of this server.');
      }
      break;

    case 'ban':
      if (!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply('You do not have permissions to ban members.');
      }
      const bannedMember = message.mentions.members.first();
      if (bannedMember) {
        bannedMember.ban().then(() => {
          message.channel.send(`${bannedMember.displayName} was banned.`);
        }).catch(err => {
          message.channel.send('I was unable to ban the member.');
          console.error(err);
        });
      } else {
        message.channel.send('Please mention a valid member of this server.');
      }
      break;

    case 'say':
      if (!message.member.permissions.has('ADMINISTRATOR')) {
        return await message.reply({ content: 'Missing permissions' });
      }
      const text = args.join(' ');
      if (!text) return await message.reply({ content: 'Put what you want to say' });
      const embedSay = new MessageEmbed()
        .setColor('BLUE')
        .setDescription(text);
      await message.channel.send({ embeds: [embedSay] });
      break;

    case 'embed':
      const embed = new MessageEmbed()
        .setTitle('Discord Announcement made by KAPPA')
        .setDescription('Καλησπέρα σας είμαι το Luna Bot.')
        .setImage('https://example.com/image.png') // Replace with your image URL
        .setColor('#0099ff'); // You can set any color you like
      message.channel.send({ embeds: [embed] });
      break;

    case 'userinfo':
      const targetUser = message.mentions.users.first() || message.author;
      const userInfoEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setDescription(`**User Information:**\n\n` +
          `**Tag:** ${targetUser.tag}\n` +
          `**Username:** ${targetUser.username}\n` +
          `**User ID:** \`\`${targetUser.id}\`\`\n` +
          `**Created At:** ${targetUser.createdAt.toDateString()}\n` +
          `**Joined At:** ${message.guild.members.cache.get(targetUser.id).joinedAt.toDateString()}`);
      message.channel.send({ embeds: [userInfoEmbed] });
      break;

    case 'clear':
      const amount = parseInt(args[0]);
      if (isNaN(amount)) {
        return await message.reply({ content: `**Βάλε μόνο αριθμόυς!**` });
      } else if (amount < 1 || amount > 100) {
        return await message.reply({ content: `**Βάλε μόνο έναν αριθμό απο το 1-100!**` });
      }
      try {
        const messages = await message.channel.messages.fetch({ limit: amount });
        const res = new MessageEmbed()
          .setColor('BLUE')
          .setDescription(`**Έγιναν delete ${messages.size} μυνήματα**`);
        await message.channel.bulkDelete(amount, true);
        const msg = await message.channel.send({ embeds: [res] });
        setTimeout(() => {
          msg.delete();
        }, 2000);
      } catch (error) {
        console.error(error);
      }
      break;

    case 'giveaway':
      const title = args.join(' ') || '🔫Giveaway bot made by KAPPA';
      const imageUrl = 'https://media.discordapp.net/attachments/1061686552989802516/1221513270133919855/akropoli.gif?ex=663d09e2&is=663bb862&hm=d21df8411031e9b6a2c08aa9076a3679da074eca4524671295cdfcf4c3d70a44&'; // Replace with your image URL
      const giveawayEmbed = new MessageEmbed()
        .setTitle(title)
        .setDescription('🎉 **Giveaway!** 🎉\nReact with 🎉 to enter!\nEnds in 24 hours!')
        .setImage(imageUrl)
        .setColor('#00ff00')
        .setFooter('⭐The Winner Won Spotify Premium');
      message.channel.send({ embeds: [giveawayEmbed] }).then(sentEmbed => {
        sentEmbed.react('🎉');
      });
      break;
  }
});

client.login(token);