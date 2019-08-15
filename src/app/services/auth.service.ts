import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private confirmResult: firebase.auth.ConfirmationResult;
  user: any;
  constructor(private fAuth: AngularFireAuth) {
    this.fAuth.user.subscribe((user) => {
      if (user) {
        console.log(user);
      } else {
        console.log("NO USER");
        this.initPhoneLogin();
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

  async sendLoginCode() {
    const appVerifier = this.recaptchaVerifier;
    // const num = "+12222222222";
    const num = "+14356789874";
    try {
      this.confirmResult = await this.fAuth.auth.signInWithPhoneNumber(num, appVerifier);
      // this.confirmResult = await firebase.auth().signInWithPhoneNumber(num, appVerifier);
      await this.verifyCode();
    } catch (error) {
      console.log(error);
    }
  }

  private async verifyCode() {
    if (this.confirmResult) {
      const verification = prompt('Enter verification code');
      try {
        const user = await this.confirmResult.confirm(verification);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async logout() {
    await this.fAuth.auth.signOut();
  }
}
