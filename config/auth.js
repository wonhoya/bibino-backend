const admin = require("firebase-admin");

const { firebaseDatabaseURL } = require("./");
const serviceAccount = require("../bibino-311310-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseDatabaseURL,
});

const authenticateUser = async (idToken) => {
  const { name, email, picture, uid } = await admin
    .auth()
    .verifyIdToken(idToken);

  return { name, email, picture, uid };
};

exports.authenticateUser = authenticateUser;
