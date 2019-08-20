import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentYear = 0;
  rankingUsers$: Observable<User[]>;
  dataSource = [
    { name: "Christian Vitting Jensen Hansen Nicolaisen", points: 122 },
    { name: "Christian Nicolaisen", points: 120 },
    { name: "Christian Nicolaisen", points: 118 },
    { name: "Christian Nicolaisen", points: 116 }
  ];
  constructor(
    private navbarService: NavbarService,
    private router: Router,
    private utilityService: UtilityService,
    private firestoreService: FirestoreService) {
      this.currentYear = this.utilityService.currentYear;
    }

  ngOnInit() {
    this.navbarService.navbarTitle = "Ranglisten";
    this.rankingUsers$ = this.firestoreService.getRanking();
  }

  addMatchClicked() {
    this.router.navigate(["/matchs/add"]);
  }

  rowClicked(user: User, position: number) {
    this.router.navigate(["/users", user.id], {
      queryParams: {
        p: position
      }
    });
  }
}
