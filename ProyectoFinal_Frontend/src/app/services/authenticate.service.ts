import { Injectable, resource } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private app = initializeApp(environment.firebase);
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

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error) => {
        throw error;
      });
  }

  logout(): void {
    this.auth.signOut();
  }


}
