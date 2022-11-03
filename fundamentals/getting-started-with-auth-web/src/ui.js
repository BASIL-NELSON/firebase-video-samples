import { AuthErrorCodes } from 'firebase/auth';

export const txtEmail = document.querySelector('#txtEmail')
export const txtPassword = document.querySelector('#txtPassword')


export const btnLogin = document.querySelector('#btnLogin')
export const btnSignup = document.querySelector('#btnSignup')


export const btnLogout = document.querySelector('#btnLogout')

export const btnGoogle = document.querySelector('#btnGoogle')

export const divAuthState = document.querySelector('#divAuthState')
export const lblAuthState = document.querySelector('#lblAuthState')

export const divLoginError = document.querySelector('#divLoginError')
export const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

export const showLoginForm = () => {
  login.style.display = 'block'
  app.style.display = 'none'  
}

export const showApp = () => {
  login.style.display = 'none'
  applogout.style.display = 'block'
}

export const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
  divLoginError.style.display = 'block'    
  if (error.code == error.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
  }
  else if(error.message == "Firebase: Error (auth/invalid-email).") {
    lblLoginErrorMessage.innerHTML = `Not a valid email. try again.`      
  } 
  else if(error.code == AuthErrorCodes.EMAIL_EXISTS) {
    lblLoginErrorMessage.innerHTML = `This email already has an account associated with it.`
  } 
  else if(error.message == "Firebase: Error (auth/internal-error)." || error.message == "Firebase: Error (auth/missing-email).") {
    lblLoginErrorMessage.innerHTML = `fill out both fields. try again.`
  } 
  else if(error.message == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
    lblLoginErrorMessage.innerHTML = `Password must be at least 6 characters. try again.`

  }
  else {
    lblLoginErrorMessage.innerHTML = `Error: Contact site owner.`
    console.log(error)    
  }
}

export const showLoginState = (user) => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}

hideLoginError()