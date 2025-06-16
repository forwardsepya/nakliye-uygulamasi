import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBk5zZ4tgnNwrcFzMqtfQbml8qpsZ-4EaM",
  authDomain: "nakliye-app-18e20.firebaseapp.com",
  databaseURL: "https://nakliye-app-18e20-default-rtdb.firebaseio.com",
  projectId: "nakliye-app-18e20",
  storageBucket: "nakliye-app-18e20.appspot.com",
  messagingSenderId: "656861628891",
  appId: "1:656861628891:web:788f22b2a5b640a6e13ffe"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
