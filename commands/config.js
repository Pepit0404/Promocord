const guildService = require ('../services/guild-service');

module.exports = {
  name: 'config',
  description: 'Guild configuration for promocord!',
  public: false,
  async execute(interaction) {
    const subCommand = interaction.options.getSubCommand();
    const subCommandGroup = interaction.options.getSubCommandGroup();

    switch (subCommandGroup) {
      case 'admin':
        switch (subCommand) {
          case 'add':
            await addAdmin(interaction);
            break;
          case 'remove':
            await removeAdmin(interaction);
            break;
          case 'list':
            await listAdmins(interaction);
            break;
        }
        break;
    }
  },
};

async function removeAdmin(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  const role = interaction.options.getRole('role').id;
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    const isAdmin = persistedGuild.data()?.admins?.includes(role);
    if (isAdmin) {
      await guildService.removeAdmin(guildId, role);
      await interaction.reply('The requested role is not an admin anymore!');
    } else {
      await interaction.reply('The requested role is not an admin!');
    }
  }
}

async function addAdmin(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  const role = interaction.options.getRole('role').id;
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    const isAdmin = persistedGuild.data()?.admins?.includes(role);
    if (isAdmin) {
      await interaction.reply('The requested role is already an admin anymore!');
    } else {
      await guildService.addAdmin(guildId, role);
      await interaction.reply('The requested role is now an admin!');
    }
  }
}

async function listAdmins(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    let adminsArray = persistedGuild.data()?.admins;
    let list = 'The roles can use the bot:';
    if( !adminsArray || adminsArray.length == 0) {
      list = 'No admins found.'
    } else {
      for (let item of adminsArray) {
        list+='\r\n- <@&'+item+'>';
      }
    }
    await interaction.reply(list);
  }
}