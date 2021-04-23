const admin = require("firebase-admin");

const serviceAccount = require("../bibino-311310-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const authenticateUser = async (idToken) => {

  const { name, email, picture } = await admin.auth().verifyIdToken(idToken);

  return { name, email, picture };
};

module.exports = authenticateUser;