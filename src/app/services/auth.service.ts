import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { SplashService } from './splash.service';
import { User } from '../models/user.model';
import { Subscription, of, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { catchError } from 'rxjs/operators';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser: firebase.User;
  userId: string;
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private confirmResult: firebase.auth.ConfirmationResult;
  private usersIndex: { [key: string]: User } = {};
  private users: User[] = [];
  private authChange = new BehaviorSubject<firebase.User>(null);
  private usersSub: Subscription;
  constructor(
    private fAuth: AngularFireAuth,
    private splashService: SplashService,
    private utilityService: UtilityService,
    private firestoreService: FirestoreService) {
    this.fAuth.user.subscribe(async (user) => {
      this.authUser = user;
      this.userId = user ? user.uid : null;
      if (user) {
        await this.getUsers();
        await this.checkIfUserHasCurrentStat();
      } else {
        this.users = [];
        this.usersIndex = {};
        console.log("NO USER");
      }
      this.emitAuthChange(user);
      this.splashService.showSplashScreen = false;
    });
  }

  private async checkIfUserHasCurrentStat(): Promise<null> {
    const year = this.utilityService.currentYear;
    if (this.usersIndex[this.userId] && !(year in this.usersIndex[this.userId].seasons)) {
      const result = await this.firestoreService.addStatToUser(this.usersIndex[this.userId]);
    }

    return null;
  }

  private getUsers(): Promise<null> {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
    return new Promise((resolve) => {
      this.usersSub = this.firestoreService.getUsers().pipe(catchError((error) => {
        console.error("getUsers", error);
        return of([]);
      })).subscribe((users: User[]) => {
        this.users = users;

        for (const user of users) {
          this.usersIndex[user.id] = user;
        }
        resolve(null);
      });
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

  getUserInfo(userId: string) {
    return this.usersIndex[userId];
  }

  getUsersAsArray() {
    return this.users;
  }

  private emitAuthChange(authUser: firebase.User) {
    this.authChange.next(authUser);
  }

  get authChange$() {
    return this.authChange;
  }
}
