import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAoa4PTwF9tHfWDe0DAsmwabBvstCvRp-I',
  authDomain: 'chatcordd.firebaseapp.com',
  projectId: 'chatcordd',
  storageBucket: 'chatcordd.appspot.com',
  messagingSenderId: '868806620871',
  databaseURL: 'https://chatcordd-default-rtdb.europe-west1.firebasedatabase.app',
  appId: '1:868806620871:web:f64dc0a698284bec3530e2',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
