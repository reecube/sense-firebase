module.exports = function () {
    var admin = require("firebase-admin");

    var serviceAccount = require('./firebaseServiceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });

    return admin;
};
