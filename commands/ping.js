module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  public: true,
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};