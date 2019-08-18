import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
    private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.navbarService.navbarTitle = "Ranglisten";
    this.rankingUsers$ = this.firestoreService.getRanking();
  }
  addMatchClicked() {
    this.router.navigate(["/matchs/add"]);
  }

  rowClicked(user: User) {
    console.log(user);
  }
}
