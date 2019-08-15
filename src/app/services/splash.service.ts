import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  private splashShow: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  get splashScreenChanges$() {
    return this.splashShow;
  }

  set showSplashScreen(show: boolean) {
    this.splashShow.next(show);
  }
}
