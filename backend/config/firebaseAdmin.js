const { cert, getApps, initializeApp } = require("firebase-admin/app");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

let app;

if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccountPath),
  });
} else {
  app = getApps()[0];
}

module.exports = app;
