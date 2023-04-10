const guildService = require ('../services/guild-service');

module.exports = {
  name: 'quit',
  description: 'quit promocord!',
  public: false,
  async execute(interaction) {
    const persistedGuild = await guildService.getGuild(interaction.guildId);
    if(persistedGuild.exists) {
      await guildService.remove(interaction.guildId);
      await interaction.reply('This server is not enrolled anymore!');
    } else {
      await interaction.reply('This server is not enrolled!');
    }
  },
};