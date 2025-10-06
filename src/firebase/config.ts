import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAgsr2HJeJCxZbPvl3jUHHOn6pI9T1wHuU",
    authDomain: "collegesaftey.firebaseapp.com",
    projectId: "collegesaftey",
    storageBucket: "collegesaftey.firebasestorage.app",
    messagingSenderId: "737542204421",
    appId: "1:737542204421:web:fc20c8fdaa24cbf84f806c",
    measurementId: "G-QJ8JP4TKYY"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
