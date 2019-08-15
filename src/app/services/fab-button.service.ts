import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabButtonService {
  private showFabButtonSubject: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  get showFabButtonChange$() {
    return this.showFabButtonSubject;
  }

  set showFabButton(show: boolean) {
    this.showFabButtonSubject.next(show);
  }
}
