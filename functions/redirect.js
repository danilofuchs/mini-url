const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/**
 * Redirects you to something nice
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const DB = {
    "/url1": "https://google.com",
    "/url2": "https://youtube.com"
  };
  
exports.redirect = functions.https.onRequest((req, res) => {
    res.setHeader("Location", DB[req.path] || "https://www.duolingo.com/");
    res.status(302).send();
});