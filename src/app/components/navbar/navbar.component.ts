import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showProgressbar = false;
  showProgressbarChangeSub: Subscription;
  navbarTitleChangeSub: Subscription;
  title = "Rangliste";
  constructor(private navbarService: NavbarService, private router: Router) { }

  ngOnInit() {
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
  }


  menuItemClick(itemClicked: string) {

  }

  gotoHome() {
    this.router.navigate(["/"]);
  }
}
