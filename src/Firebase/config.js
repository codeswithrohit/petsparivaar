import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  // Paste Your firebase config here
  apiKey: "AIzaSyB1X_5b2eAwlFd1pQTFXeTfx4kf9CkOSDs",
  authDomain: "petsparivaaar.firebaseapp.com",
  projectId: "petsparivaaar",
  storageBucket: "petsparivaaar.appspot.com",
  messagingSenderId: "795174723502",
  appId: "1:795174723502:web:2b0d0fd4a4f29a1e78f23f"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export both firebase and auth
const auth = firebase.auth();
export { firebase, auth };
