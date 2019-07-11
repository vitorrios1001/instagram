const admin = require('firebase-admin');

//const keys = require('./keys');

const firebaseKey = {
    type: process.env.FIREBASE_TYPE || keys.firebase.type,
    project_id: process.env.FIREBASE_PROJECT_ID || keys.firebase.project_id,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || keys.firebase.private_key_id,
    private_key: process.env.FIREBASE_PRIVATE_KEY || keys.firebase.private_key,
    client_email: process.env.FIREBASE_CLIENT_EMAIL || keys.firebase.client_email,
    client_id: process.env.FIREBASE_CLIENT_ID || keys.firebase.client_id,
    auth_uri: process.env.FIREBASE_AUTH_URI || keys.firebase.auth_uri,
    token_uri: process.env.FIREBASE_TOKEN_URI || keys.firebase.token_uri,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || keys.firebase.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || keys.firebase.client_x509_cert_url,
}

admin.initializeApp({
    credential: admin.credential.cert(firebaseKey)
});

module.exports = {
    storage: admin.storage
}

