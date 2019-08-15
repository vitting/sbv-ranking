import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private showProgressbarSub = new Subject<boolean>();
  private navbarTitleSub = new Subject<string>();
  constructor() { }

  get showProgressbarChange$() {
    return this.showProgressbarSub;
  }

  set showProgressbar(show: boolean) {
    this.showProgressbarSub.next(show);
  }

  get navbarTitleChange$() {
    return this.navbarTitleSub;
  }

  set navbarTitle(title: string) {
    this.navbarTitleSub.next(title);
  }
}
