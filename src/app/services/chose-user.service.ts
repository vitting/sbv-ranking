import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

export interface ChoseUserResult {
  player: number;
  user: User;
}

export interface ChoseUserShow {
  player: number;
  show: boolean;
  chosenUserIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ChoseUserService {
  private showChoseUserSub = new Subject<ChoseUserShow>();
  constructor() { }

  get showChoseUserChange$() {
    return this.showChoseUserSub;
  }

  showChoseUser(data: ChoseUserShow) {
    this.showChoseUserSub.next(data);
  }
}
