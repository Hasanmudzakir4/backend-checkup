const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccount.json');


// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to test Firestore connection
const testFirestoreConnection = async () => {
  try {
    // Cek koneksi dengan mencoba untuk mengambil data dari koleksi atau dokumen tertentu
    const testDoc = await db.collection('test').doc('connection').get();
    
    if (testDoc.exists) {
      console.log('Firebase connection successful');
    } else {
      console.log('Document does not exist');
    }
  } catch (error) {
    console.error('Error connecting to Firebase Firestore:', error);
  }
};

// Test Firestore connection
testFirestoreConnection();

module.exports = { admin, db };
