const { cert, getApps, initializeApp } = require("firebase-admin/app");

const getServiceAccount = () => {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (rawJson) {
    try {
      return JSON.parse(rawJson);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return null;
};

let app;

if (!getApps().length) {
  const serviceAccount = getServiceAccount();

  if (!serviceAccount) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

module.exports = app;
