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
  btnGoogle,
  showFileUpload
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
import {
  getStorage, 
  ref,
  uploadBytes,
  uploadString
} from 'firebase/storage';
import{
  getFirestore,
  updateDoc,
  addDoc,
  collection,
  Firestore,
  doc,
  setDoc,
  Timestamp,
  

} from 'firebase/firestore'
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCfx1W3sLJ58Cwz0CBl8HIgv3XxrO1Fu_M",
  authDomain: "newproject-a6cfe.firebaseapp.com",
  projectId: "newproject-a6cfe",
  storageBucket: "gs://newproject-a6cfe.appspot.com/",
  messagingSenderId: "317196709726",
  appId: "1:317196709726:web:d6cb2ab25887606c8b29cf",
  measurementId: "G-CBDNGYL5S7"
});






// Login using email/password
const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value
  const loginPassword = txtPassword.value

  // step 1: try doing this w/o error handling, and then add try/catch
  // await signInWithEmailAndPassword(auth, loginEmail, loginPassword)

  // step 2: add error handling
  try {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  }
  catch(error) {
    console.log(`There was an error: ${error}`)
    showLoginError(error)
  }
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

const saveTheDate = async (user) => {
  const docData = {
    login_Dates: Timestamp.fromDate(new Date())

    
  };
  const blankDoc = {

  };

 
  await setDoc(doc(db, "usr/", user.uid),  blankDoc,  {merge: true});
  await addDoc(collection(db, "usr/" + user.uid + "/logins"), docData);
}

// Monitor sdfauth state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    
    console.log(date);
    if (user) {
      console.log(user)
      showApp()
      showLoginState(user)

      hideLoginError()
      saveTheDate(user)
      // userRef = ref(storage, 'users/' + user.uid + '/signins.txt');
      // uploadString (userRef, dateString).then((snapshot) => {
      //   console.log("tried")
      // });
      // hideLinkError()
    }
    else {
      showLoginForm()
      lblAuthState.innerHTML = `You're not logged in.`
    }
  })
}

function uploadFile(files) {
  const storageRef = firebase.storage().ref();
  const imgRef = storageRef.child('horse.jpg');

  const file = files.item(0);

  const task = imgRef.put(file)

  // successful upload
  task.then(snapshot => {
      const url = snapshot.downloadURL
  })

  // monitor progress
  task.on('state_changed', snapshot => {
      console.log(snapshot)

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

var date = new Date();
var dateString;


const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);
const db = getFirestore();
const path = doc(db, '/usr/newdoc');
var userRef;


// connectAuthEmulator(auth, "http://localhost:9099");
// connectAuthEmulator(auth, "http://localhost:9099");

monitorAuthState();
