const admin = require("firebase-admin");
admin.initializeApp();

const { redirect } = require("./redirect");
const { minifyUrl } = require("./minifyUrl");

exports.redirect = redirect;
exports.minifyUrl = minifyUrl;
