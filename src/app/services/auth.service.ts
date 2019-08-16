import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private confirmResult: firebase.auth.ConfirmationResult;
  authUser: firebase.User;
  userId: string;
  constructor(private fAuth: AngularFireAuth) {
    this.fAuth.user.subscribe((user) => {
      this.authUser = user;
      this.userId = user ? user.uid : null;
      if (user) {
        console.log(user);
        console.log(user.uid);
      } else {
        console.log("NO USER");
      }
    });
  }

  initPhoneLogin() {
    if (firebase.apps.length) {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        { size: "invisible" },
        firebase.app("sbv-ranking"));
    }
  }

  async sendLoginCode(mobilenumber: number) {
    const appVerifier = this.recaptchaVerifier;
    const num = "+45" + mobilenumber.toString();
    try {
      this.confirmResult = await this.fAuth.auth.signInWithPhoneNumber(num, appVerifier);
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async verifyCode(verificationCode: string): Promise<firebase.auth.UserCredential> {
    if (this.confirmResult) {
      return this.confirmResult.confirm(verificationCode);
    }

    return Promise.resolve(null);
  }

  async logout() {
    await this.fAuth.auth.signOut();
  }
}
