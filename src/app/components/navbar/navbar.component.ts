import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showProgressbar = false;
  showProgressbarChangeSub: Subscription;
  navbarTitleChangeSub: Subscription;
  authChangeSub: Subscription;
  title = "Rangliste";
  user: User;
  profileSrc: string = null;
  constructor(
    private authService: AuthService,
    private utilityService: UtilityService,
    private navbarService: NavbarService,
    private router: Router) { }

  ngOnInit() {
    this.authService.authChange$.subscribe((authUser) => {


      if (authUser) {
        this.user = this.authService.getUserInfo(authUser.uid);

        if (this.user) {
          this.profileSrc = this.user.photoUrl ? this.user.photoUrl : this.utilityService.noProfileImage;
        }
      } else {
        this.profileSrc = null;
        this.user = null;
      }
    });

    this.showProgressbarChangeSub = this.navbarService.showProgressbarChange$.subscribe((show) => {
      this.showProgressbar = show;
    });

    this.navbarTitleChangeSub = this.navbarService.navbarTitleChange$.subscribe((title) => {
      this.title = title;
    });
  }

  ngOnDestroy(): void {
    if (this.showProgressbarChangeSub) {
      this.showProgressbarChangeSub.unsubscribe();
    }

    if (this.navbarTitleChangeSub) {
      this.navbarTitleChangeSub.unsubscribe();
    }

    if (this.authChangeSub) {
      this.authChangeSub.unsubscribe();
    }
  }


  menuItemClick(itemClicked: string) {
    switch (itemClicked) {
      case "home":
        this.gotoHome();
        break;
      case "logout":
        this.logout();
        break;
    }
  }

  private async logout() {
    await this.authService.logout();
    this.router.navigate(["login"]);
  }

  gotoHome() {
    this.router.navigate(["/"]);
  }
}
