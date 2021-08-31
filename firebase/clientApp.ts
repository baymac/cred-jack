import firebase from 'firebase/app';
import 'firebase/firestore';

const clientCredentials = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

export default firebase;
