const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

const db = admin.firestore();

function generateShortHash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").substring(0, 7);
}

function buildRedirectionUrl(hash) {
  return `https://mini-url-2b477.web.app/${hash}`;
}

exports.minifyUrl = functions.https.onRequest(async (req, res) => {
  const body = JSON.parse(req.body);
  const longUrl = body.long_url;

  console.log("Received url", longUrl);

  const shortHash = generateShortHash(longUrl);
  const shortUrl = buildRedirectionUrl(shortHash);

  console.log("Generated url", shortUrl);

  const data = {
    hash: shortHash,
    long_url: longUrl,
    short_url: shortUrl,
  };

  await db.collection("urls").doc(shortHash).set(data);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.status(200).send(data);
});
