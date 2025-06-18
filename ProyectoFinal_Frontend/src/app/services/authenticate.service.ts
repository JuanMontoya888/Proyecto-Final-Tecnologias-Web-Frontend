import { Injectable, resource } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private app = initializeApp(environment.firebase);
  private provider = new GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' });
  private auth !: any;

  constructor() {
    this.auth = getAuth(this.app);
  }


  loginWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(result => {
        const { uid } = result.user;
        return uid;
      });
  }

  loginWithPhoneNumber(phoneNumber: string, verifier: RecaptchaVerifier): Promise<any> {
    return signInWithPhoneNumber(this.auth, phoneNumber, verifier);
  }


  loginWithGoogle(): Promise<any> {
    return signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        return user;
      }).catch((error) => { throw error; });
  }

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        throw error;
      });
  }

  logout(): Promise<void> {
    return this.auth.signOut()
      .then(() => {
        console.log('Sesión cerrada');
      })
      .catch((error: any) => {
        console.error('Error al cerrar sesión:', error);
        throw error;
      });
  }

  getAuth(): any {
    return this.auth;
  }


}
