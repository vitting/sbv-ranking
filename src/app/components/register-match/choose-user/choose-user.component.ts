import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { state, transition, animate, trigger, style } from '@angular/animations';
import { FabButtonService } from 'src/app/services/fab-button.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChoseUserService, ChoseUserResult } from 'src/app/services/chose-user.service';

@Component({
  selector: 'app-choose-user',
  templateUrl: './choose-user.component.html',
  styleUrls: ['./choose-user.component.scss'],
  animations: [trigger("hideContainer", [
    state("show", style({
      opacity: '1',
      zIndex: "999"
    })),
    state("hide", style({
      opacity: '0',
      zIndex: "-20"
    })),
    transition("show => hide", animate(200)),
    transition("hide => show", animate(200))
  ])]
})
export class ChoseUserComponent implements OnInit {
  state = "hide";
  @Output() closeChoseUserClick = new EventEmitter<void>();
  @Output() addUserClick = new EventEmitter<ChoseUserResult>();
  users: User[];
  authUserId = "";
  currentPlayer = 0;
  constructor(
    private authService: AuthService,
    private fabbuttonService: FabButtonService,
    private choseUserService: ChoseUserService) { }

  ngOnInit() {
    this.authUserId = this.authService.userId;
    this.choseUserService.showChoseUserChange$.subscribe((data) => {
      if (data.show) {
        this.users = this.filterUsers(data.chosenUserIds, this.authService.getUsersAsArray());
        this.currentPlayer = data.player;
        this.state = "show";
        this.fabbuttonService.showFabButton = true;
      } else {
        this.users = [];
        this.currentPlayer = 0;
        this.state = "hide";
        this.fabbuttonService.showFabButton = false;
      }
    });
  }

  filterUsers(chosenUserIds: string[], users: User[]): User[] {
    return users.filter((value) => {
      return chosenUserIds.indexOf(value.id) === -1;
    });
  }

  addUser(user: User) {
    this.addUserClick.emit({
      player: this.currentPlayer,
      user
    });
  }

  closeAddUser() {
    this.closeChoseUserClick.emit();
  }

  @HostListener('window:keyup.esc', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.closeAddUser();
  }
}
