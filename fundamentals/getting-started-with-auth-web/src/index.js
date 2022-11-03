// import './styles.css';
import { 
  hideLoginError, 
  showLoginState, 
  showLoginForm, 
  showApp, 
  showLoginError, 
  btnLogin,
  btnSignup,
  btnLogout,
  btnGoogle
} from './ui'

import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
  
  // connectAuthEmulator
} from 'firebase/auth';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCfx1W3sLJ58Cwz0CBl8HIgv3XxrO1Fu_M",
  authDomain: "newproject-a6cfe.firebaseapp.com",
  projectId: "newproject-a6cfe",
  storageBucket: "newproject-a6cfe.appspot.com",
  messagingSenderId: "317196709726",
  appId: "1:317196709726:web:d6cb2ab25887606c8b29cf",
  measurementId: "G-CBDNGYL5S7"
});

// Login using email/password
const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value
  const loginPassword = txtPassword.value

  // step 1: try doing this w/o error handling, and then add try/catch
  await signInWithEmailAndPassword(auth, loginEmail, loginPassword)

  // step 2: add error handling
  // try {
  //   await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  // }
  // catch(error) {
  //   console.log(`There was an error: ${error}`)
  //   showLoginError(error)
  // }
}

// Create new account using email/password
const createAccount = async () => {
  const email = txtEmail.value
  const password = txtPassword.value

  try {
    await createUserWithEmailAndPassword(auth, email, password)
  }
  catch(error) {
    console.log(`There was an error: ${error}`)
    showLoginError(error)
  } 
}

const loginGoogle = async () => {
  console.log("coolBASIL")

  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)

}


// Monitor auth state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {

    if (user) {
      console.log(user)
      showApp()
      showLoginState(user)

      hideLoginError()
      // hideLinkError()
    }
    else {
      showLoginForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}

// Log out
const logout = async () => {
  await signOut(auth);
}

btnLogin.addEventListener("click", loginEmailPassword) 
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)
btnGoogle.addEventListener("click", loginGoogle)

const auth = getAuth(firebaseApp);


// connectAuthEmulator(auth, "http://localhost:9099");
// connectAuthEmulator(auth, "http://localhost:9099");

monitorAuthState();
