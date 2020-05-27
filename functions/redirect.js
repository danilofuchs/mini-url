const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.redirect = functions.https.onRequest(async (req, res) => {
  const key = req.path.replace("/", "");

  const doc = await db.collection("urls").doc(key).get();
  const data = doc.data();

  const targetUrl = data
    ? data.long_url
    : "https://github.com/danilofuchs/mini-url";

  res.setHeader("Location", targetUrl);
  res.status(302).send();
});
