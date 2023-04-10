const admin = require('firebase-admin');

const serviceAccount = require('./../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
  enroll: async function (data, guildId) {
    const docRef = db.collection('guilds').doc(guildId);
    await docRef.set(data);
  },
  refresh: async function (data) {
    const docRef = db.collection('guilds').doc(data.id);
    await docRef.update(data);
  },
  getGuild: async function (id) {
    const guild = await db.collection('guilds').doc(id).get();
    return guild;
  },
  remove: async function (id) {
    const docRef = db.collection('guilds').doc(id);
    await docRef.delete();
  },
  registerPartnership: async function (requester, data) {
    const docRef = db.collection('guilds').doc(requester);
    const partnerArray = await docRef.update({
      partners: admin.firestore.FieldValue.arrayUnion(data)
    });
  },
  getPartnerships: async function (requester) {
    const docRef = db.collection('guilds').doc(requester);
    return docRef.get();
  },
  removePartnership: async function (requester, requested) {
    const docRef = db.collection('guilds').doc(requester);
    const partnerArray = await docRef.update({
      partners: admin.firestore.FieldValue.arrayRemove(requested)
    });
  },
  addAdmin: async function (guildId, roleId) {
    const docRef = db.collection('guilds').doc(guildId);
    const partnerArray = await docRef.update({
      admins: admin.firestore.FieldValue.arrayUnion(roleId)
    });
  },
  removeAdmin: async function (guildId, roleId) {
    const docRef = db.collection('guilds').doc(guildId);
    const partnerArray = await docRef.update({
      admins: admin.firestore.FieldValue.arrayRemove(roleId)
    });
  },
};
