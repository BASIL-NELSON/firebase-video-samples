// import './styles.css';
import { 
  initializeAppCheck, 
  ReCaptchaV3Provider,
  setTokenAutoRefreshEnabled
} from 'firebase/app-check';
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
  fileUpload,
  fileButtons,
  showFiles,
  btnProfile,
  btnBack,
  showWaitLabel
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
  getDownloadURL,
  getStorage, 
  ref,
  uploadBytes,
  uploadString,
  listAll,
  
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

const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider('6LcSGH4jAAAAAFYcts-D4tOMuGQFBENha3lghDum'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});
setTokenAutoRefreshEnabled(appCheck,true);





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
 

  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)

}





////////////////////////////////////////   file Code Begin   ///////////////////////////////////////////////////////////////////////////////////






function getFilesToShow(user) {

  const listRef = ref(storage, '/users/'+ user.uid);

  listAll(listRef)
  .then((res) => {
    var i = 0;
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
    });
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      fileList[i] = itemRef.name
      paths[i] = itemRef.fullPath
      
      i++;
      
    });
    
   
    showListOfFiles(fileList, paths);
  })
  .catch((error) => {
    // Uh-oh, an error occurred!
    console.log(error)
  });
}

function showListOfFiles(fileList, paths){
  
  let main = document.getElementById('main');
  let divText = '';
  for (let i = 0; i < fileList.length; i++){
    divText += "<div class='buttonDiv'></div>"
  }
  main.innerHTML = divText;

  let m = document.getElementsByClassName('buttonDiv');
  for(let i = 0; i < m.length; i++){
    // m[i].innerHTML = `<button type="button" onclick="downloadFile(${paths[i]}, ${fileList[i]})" class="button buttonBlue">${fileList[i]}</button>`;
    m[i].innerHTML = `<button type="button" class="button buttonBlue buttonFile">${fileList[i]}</button>`;
   
    // m[i].addEventListener("click", downloadFile(paths[i], fileList[i]));
    
    // m[i].childNodes[0].setAttribute("id", `button${eval(i+1)}`);
    // m[i].childNodes[0].addEventListener("click", downloadFile(paths[i], fileList[i]));
    
  }

 
  
  for(let i = 0; i < fileButtons.length; i++){
   

    fileButtons[i].addEventListener("click", function() { 
      downloadFile(paths[i], fileButtons[i]) 
    });
    
  }
}

function downloadFile(path, file) {

  console.log("got here")

  getDownloadURL(ref(storage, path))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'

   console.log(url)

  
    fetch(url).then(res => res.blob()).then(file => {
        console.log("got here")
        let tempUrl = URL.createObjectURL(file);
        const aTag = document.createElement("a");
        aTag.href = tempUrl;
        aTag.download = url.replace(/^.*[\\\/]/, '');
        document.body.appendChild(aTag);
        aTag.click();
        
        URL.revokeObjectURL(tempUrl);
        aTag.remove();
    }).catch(() => {
        console.log("Failed to download file!");
        
    });
  

    // Or inserted into an <img> element
   
  })
  .catch((error) => {
    console.log(error)
  });
}

function listFiles(user){

  getFilesToShow(user);
  
}   

function uploadFile(files, user) {
  
  
  const file = files.item(0);
  const imgRef = ref(storage, '/users/'+ user.uid + '/' + file.name);
  
  uploadBytes(imgRef, file)
  
  .then((snapshot) => {
    console.log('Uploaded a blob or file! ' + file.name)
    listFiles(user)
    showWaitLabel(false)
    // showFiles()
    // location.reload()
  });
}

///////////////////////////////////////     file Code End      ////////////////////////////////////////////////////////////////////////

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

      fileUpload.addEventListener("change", function () {
        showWaitLabel(true)
        uploadFile(this.files, user) 
      });

      listFiles(user)

      showFiles()

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

// Log out
const logout = async () => {
  await signOut(auth);
}

btnLogin.addEventListener("click", loginEmailPassword);
btnSignup.addEventListener("click", createAccount);
btnLogout.addEventListener("click", logout);
btnGoogle.addEventListener("click", loginGoogle);

btnProfile.addEventListener("click", showApp);
btnBack.addEventListener("click", showFiles);


var date = new Date();
var fileList = [];
var paths = [];


const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);
const db = getFirestore();

console.log("hope")
console.log(fileButtons);



// connectAuthEmulator(auth, "http://localhost:9099");
// connectAuthEmulator(auth, "http://localhost:9099");

monitorAuthState();

