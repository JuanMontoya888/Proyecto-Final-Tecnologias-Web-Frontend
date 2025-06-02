import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);

  constructor() { }

  loginWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(result => {
        const { uid } = result.user;
        //console.log(result);
        // if(!result.user.emailVerified) {
        //   sendEmailVerification(result.user);
        //   this.logout();

        //   throw new Error('auth/email-not-verified');
        // }

        // This data will be send to components
        return uid;
      });
  }

  register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(result => {

      })
  }

  logout(): void {
    this.auth.signOut();
  }


}
