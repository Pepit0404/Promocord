const fs = require('fs')
const Discord = require('discord.js');
const guildService = require ('./services/guild-service');

require('dotenv').config();
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

function isPublicCommand(commandName){
  return client.commands.get(commandName).public;
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  const members = await client.guilds.cache.get(interaction.guild.id)?.members.fetch();
  const member = await members.get(interaction.user.id);

  const isAdmin = await guildService.isAdmin(interaction, member.roles.cache);
  const isPublic = isPublicCommand(interaction.commandName);

  if(!isAdmin || (!isAdmin && !isPublic)){
    await interaction.reply({ content: 'You\'re not allowed to use Promocord!', ephemeral: true });
    return;
  }

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }

});

client.login(process.env.DISCORD_API_KEY);