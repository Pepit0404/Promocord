const guildService = require ('../services/guild-service');

module.exports = {
  name: 'enroll',
  description: 'Enroll server in promocord!',
  public: false,
  async execute(interaction) {
    if(interaction.guild.ownerId == interaction.user.id){
      const persistedGuild = await guildService.getGuild(interaction.guildId);
      if(!persistedGuild.exists) {
        await guildService.enroll(interaction.guildId, interaction.guild.name);
        await interaction.reply('Enrolled!!');
      } else {
        await interaction.reply('I am already enrolled!');
      }
    } else {
      await interaction.reply('You have no power here! Only the owner can enroll the guild.');
    }
  },
};