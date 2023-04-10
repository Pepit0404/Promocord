const persistance = require('../persistance/persistance');

module.exports = {
  isAdmin: async function(interaction, userRoles){
    let isAdmin = false;
    const guild = await persistance.getGuild(interaction.guild.id);
    if (guild && guild.data()?.admins) {
      for (let item of userRoles.keys()) {
        for (let item of guild.data()?.admins) {
          isAdmin = true;
        }
      }
    }
    return (isAdmin || process.env.OWNER == interaction.user.id || interaction.guild.ownerId == interaction.user.id);
  },
  addAdmin: async function(guildId, roleId){
    await persistance.addAdmin(guildId, roleId);
  },
  removeAdmin: async function(guildId, roleId){
    await persistance.removeAdmin(guildId, roleId);
  },
  enroll: async function (id, serverName) {
    const data = {
      guildName: serverName,
      partners: [],
      admins: []
    };
    await persistance.enroll(data, id);
  },
  getGuild: async function (id) {
    return await persistance.getGuild(id);
  },
  remove: async function (id) {
    await persistance.remove(id);
  },
  registerPartnership: async function (requester, requested, requestedServerName) {
    const data = generatePartner(requested, requestedServerName)
    await persistance.registerPartnership(requester, data);
  },
  getPartnerships: async function (requester) {
    return await persistance.getPartnerships(requester);
  },
  removePartnership: async function (requester, requested) {
    await persistance.removePartnership(requester, requested);
  },
}

function generatePartner(requested, requestedServerName) {
  return {"id":requested,"guildName":requestedServerName};
}