const guildService = require ('../services/guild-service');

module.exports = {
  name: 'partnership',
  description: 'Ask for partnership to another server in promocord!',
  public: false,
  async execute(interaction) {
    const subCommand = interaction.options.getSubCommand();

    switch (subCommand) {
      case 'create':
        await createPartnership(interaction);
        break;
      case 'remove':
        await removePartnership(interaction);
        break;
      case 'status':
        await checkPartnership(interaction);
        break;
      case 'list':
        await listPartnerships(interaction);
        break;
    }
  },
};

async function createPartnership(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  const partnerId = interaction.options.getString('server');
  const persistedPartner = await guildService.getGuild(partnerId);
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    if (!persistedPartner.exists) {
      await interaction.reply('The requested partner isn\'t enrolled!');
    } else {
      const partner  = findPartner(persistedGuild, partnerId);
      const partnerInfo  = findPartner(persistedPartner, guildId);
      if (partner && partnerInfo) {
        await interaction.reply('This partnership is already active!');
      } else if (partner && !partnerInfo) {
        await interaction.reply('This partnership is pending!');
      } else {
        const partnerName = persistedPartner.data()?.guildName;
        await guildService.registerPartnership(guildId, partnerId, partnerName);
        if(partnerInfo){
          await interaction.reply('This partnership is now validated!');
        } else {
          await interaction.reply('This partnership is now pending!');
        }
      }
    }
  }
}

async function removePartnership(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  const partnerId = interaction.options.getString('server');
  const persistedPartner = await guildService.getGuild(partnerId);
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    if (!persistedPartner.exists) {
      await interaction.reply('The requested partner isn\'t enrolled!');
    } else {
      const partner  = findPartner(persistedGuild, partnerId);
      const partnerInfo  = findPartner(persistedPartner, guildId);
      let hasBeenRemoved = false;
      if (partner) {
        await guildService.removePartnership(guildId, partnerId);
        hasBeenRemoved = true;
      }
      if(partnerInfo){
        await guildService.removePartnership(partnerId, guildId);
        hasBeenRemoved = true;
      }
      if (hasBeenRemoved) {
        await interaction.reply('This partnership (even pending) is now closed!');
      }
    }
  }
}

async function checkPartnership(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  const partnerId = interaction.options.getString('server');
  const persistedPartner = await guildService.getGuild(partnerId);
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    if (!persistedPartner.exists) {
      await interaction.reply('The requested partner isn\'t enrolled!');
    } else {
      const partner  = findPartner(persistedGuild, partnerId);
      const partnerInfo  = findPartner(persistedPartner, guildId);
      if (partner && partnerInfo) {
        await interaction.reply('This partnership is active!');
      } else if (partner && !partnerInfo) {
        await interaction.reply('This partnership is pending from the partner side!');
      } else if (!partner && partnerInfo){
        await interaction.reply('This partnership is pending from your side!');
      } else {
        await interaction.reply('This partnership hasn\'t started!');
      }
    }
  }
}

async function listPartnerships(interaction){
  const guildId = interaction.guildId;
  const persistedGuild = await guildService.getGuild(guildId);
  if (!persistedGuild.exists) {
    await interaction.reply('You need to be enrolled to do that!');
  } else {
    let partnersArray = persistedGuild.data()?.partners;
    let list = 'The following server ID\'s are your partners (includes requested ones):';
    if( !partnersArray || partnersArray.length == 0) {
      list = 'No partnership found.'
    } else {
      for (let item of partnersArray) {
        let name = item.guildName? item.guildName : item.id;
        list+='\r\n- '+name;
      }
    }
    await interaction.reply(list);
  }
}

function findPartner(guild, partnerId){
  if (!guild.data()?.partners) return;
  for (let item of guild.data()?.partners) {
    if ( item.id = partnerId) return item;
  }
  return;
}