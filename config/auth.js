const admin = require("firebase-admin");

const serviceAccount = require("../bibino-311310-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const authenticateUser = async (idToken) => {
  debugger;
  const { verifyIdToken } = admin.auth();
  const decodedToken = await verifyIdToken(idToken);
  console.log(decodedToken);
};

module.exports = authenticateUser;
