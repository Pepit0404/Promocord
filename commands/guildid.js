module.exports = {
  name: 'guildid',
  description: 'Replies with your guild id!',
  public: true,
  async execute(interaction) {
    await interaction.reply(interaction.guildId);
  },
};