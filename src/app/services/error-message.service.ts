import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private showMessageSub = new Subject<boolean>();
  constructor() { }

  get showMessageChanges$() {
    return this.showMessageSub;
  }

  set showMessage(show: boolean) {
    this.showMessageSub.next(show);
  }
}
