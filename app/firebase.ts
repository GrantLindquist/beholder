import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCQZ0jvdowf8DLM0_hzAvGqvy2L6D4TltE',
  authDomain: 'beholder-10cfd.firebaseapp.com',
  projectId: 'beholder-10cfd',
  storageBucket: 'beholder-10cfd.appspot.com',
  messagingSenderId: '805566506086',
  appId: '1:805566506086:web:b95c88161e23c067ef79a7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth();
export default db;
