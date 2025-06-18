import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
  authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
  databaseURL: Constants.expoConfig.extra.firebaseDatabaseURL,
  projectId: Constants.expoConfig.extra.firebaseProjectId,
  storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
  appId: Constants.expoConfig.extra.firebaseAppId
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
