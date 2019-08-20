import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { User } from 'src/app/models/user.model';
import { ChoseUserService, ChoseUserResult } from 'src/app/services/chose-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ChosenUsers {
  player1: User;
  player2: User;
  player3: User;
  player4: User;
  matchDate?: Date;
}

@Component({
  selector: 'app-register-match',
  templateUrl: './register-match.component.html',
  styleUrls: ['./register-match.component.scss']
})
export class RegisterMatchComponent implements OnInit {
  showProfile1 = false;
  showProfile2 = false;
  showProfile3 = false;
  showProfile4 = false;
  player1Src = "";
  player2Src = "";
  player3Src = "";
  player4Src = "";
  date = new Date(Date.now());
  enableButton = false;
  chosenUsers: ChosenUsers = {
    player1: null,
    player2: null,
    player3: null,
    player4: null
  };
  chosenUserIds: string[] = [];
  constructor(
    private navbarService: NavbarService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private utilityService: UtilityService,
    private errorMessageService: ErrorMessageService,
    private snackBar: MatSnackBar,
    private choseUserService: ChoseUserService) { }

  ngOnInit() {
    this.navbarService.navbarTitle = "Registrer kamp";
    this.initForm();
  }

  initForm() {
    this.date = new Date(Date.now());
    this.player1Src = this.utilityService.noProfileImage;
    this.player2Src = this.utilityService.noProfileImage;
    this.player3Src = this.utilityService.noProfileImage;
    this.player4Src = this.utilityService.noProfileImage;
    this.showProfile1 = false;
    this.showProfile3 = false;
    this.showProfile2 = false;
    this.showProfile4 = false;
    this.enableButton = false;
    this.chosenUsers = {
      player1: null,
      player2: null,
      player3: null,
      player4: null
    };
    this.chosenUserIds = [];
  }

  async onSubmit() {
    this.enableButton = false;
    this.navbarService.showProgressbar = true;
    const data: ChosenUsers = this.chosenUsers;
    data.matchDate = this.date;
    const result = await this.firestoreService.addMatch(this.authService.userId, data);
    this.navbarService.showProgressbar = false;
    if (!result) {
      this.enableButton = true;
      this.errorMessageService.showMessage = true;
    } else {
      this.initForm();
      this.snackBar.open("Kampen er blever oprettet!", null, {
        duration: 1000
      });
    }
  }

  dateInput(event: MatDatepickerInputEvent<Moment>) {
    this.date = event.value.toDate();
  }

  showAddUser(player: number) {
    this.resetChosenUser(player);
    this.showUserDialog(player);
  }

  private resetChosenUser(player: number) {
    switch (player) {
      case 1:
        if (this.chosenUsers.player1) {
          this.chosenUsers.player1 = null;
          this.player1Src = this.utilityService.noProfileImage;
          this.showProfile1 = false;
          this.setChosenUserIds();
        }
        break;
      case 2:
        if (this.chosenUsers.player2) {
          this.chosenUsers.player2 = null;
          this.player2Src = this.utilityService.noProfileImage;
          this.showProfile2 = false;
          this.setChosenUserIds();
        }
        break;
      case 3:
        if (this.chosenUsers.player3) {
          this.chosenUsers.player3 = null;
          this.player3Src = this.utilityService.noProfileImage;
          this.showProfile3 = false;
          this.setChosenUserIds();
        }
        break;
      case 4:
        if (this.chosenUsers.player4) {
          this.chosenUsers.player4 = null;
          this.player4Src = this.utilityService.noProfileImage;
          this.showProfile4 = false;
          this.setChosenUserIds();
        }
        break;
    }
  }

  private showUserDialog(player: number) {
    this.choseUserService.showChoseUser({
      player,
      show: true,
      chosenUserIds: this.chosenUserIds
    });

    if (player < 3) {
      this.navbarService.navbarTitle = "Vælg vinder";
    } else {
      this.navbarService.navbarTitle = "Vælg taber";
    }
  }

  userChoosen(result: ChoseUserResult) {
    switch (result.player) {
      case 1:
        this.chosenUsers.player1 = result.user;
        this.player1Src = result.user.photoUrl ? result.user.photoUrl : this.utilityService.noProfileImage;
        this.showProfile1 = result.user.photoUrl !== null;
        break;
      case 2:
        this.chosenUsers.player2 = result.user;
        this.player2Src = result.user.photoUrl ? result.user.photoUrl : this.utilityService.noProfileImage;
        this.showProfile2 = result.user.photoUrl !== null;
        break;
      case 3:
        this.chosenUsers.player3 = result.user;
        this.player3Src = result.user.photoUrl ? result.user.photoUrl : this.utilityService.noProfileImage;
        this.showProfile3 = result.user.photoUrl !== null;
        break;
      case 4:
        this.chosenUsers.player4 = result.user;
        this.player4Src = result.user.photoUrl ? result.user.photoUrl : this.utilityService.noProfileImage;
        this.showProfile4 = result.user.photoUrl !== null;
        break;
    }

    this.chooseUserClosed();
    this.setChosenUserIds();
    this.enableSubmitButton();
  }

  private setChosenUserIds() {
    this.chosenUserIds = [];
    for (const key in this.chosenUsers) {
      if (this.chosenUsers.hasOwnProperty(key)) {
        const user: User = this.chosenUsers[key];
        if (user) {
          this.chosenUserIds.push(user.id);
        }
      }
    }
  }

  chooseUserClosed() {
    this.choseUserService.showChoseUser({
      player: 0,
      show: false,
      chosenUserIds: []
    });
    this.navbarService.navbarTitle = "Registrer kamp";
  }

  enableSubmitButton() {
    if (this.chosenUserIds.length === 4) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }
}
