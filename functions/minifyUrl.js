const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

const db = admin.firestore();

function validateUrl(inputUrl) {
  return /^[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
    inputUrl
  );
}

/**
 * @param {String} inputUrl
 */
function addHttpsIfAbsent(inputUrl) {
  if (inputUrl.includes("://")) {
    return inputUrl;
  }
  return `https://${inputUrl}`;
}

function generateShortHash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").substring(0, 7);
}

function buildRedirectionUrl(hash) {
  return `https://mini-url-2b477.web.app/${hash}`;
}

exports.minifyUrl = functions.https.onRequest(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Allow", "POST");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).send();
  }

  try {
    const longUrl = req.body.long_url;

    if (!validateUrl(longUrl)) {
      return res.status(400).send({
        code: "ERROR_INVALID_URL",
        message: "The provided URL is invalid",
      });
    }

    console.log("Received url", longUrl);
    const fixedUrl = addHttpsIfAbsent(longUrl);
    console.log("Fixed url to", fixedUrl);
    const shortHash = generateShortHash(fixedUrl);
    const shortUrl = buildRedirectionUrl(shortHash);

    console.log("Generated url", shortUrl);

    const data = {
      hash: shortHash,
      long_url: fixedUrl,
      short_url: shortUrl,
    };

    await db.collection("urls").doc(shortHash).set(data);

    return res.status(200).send(data);
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: "ERROR_UNKNOWN",
      message: "Unknown server error",
    });
  }
});
