import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataSource = [
    { position: 1, name: "Christian Vitting Jensen Hansen Nicolaisen", points: 122 },
    { position: 2, name: "Christian Nicolaisen", points: 120 },
    { position: 3, name: "Christian Nicolaisen", points: 118 },
    { position: 4, name: "Christian Nicolaisen", points: 116 },
    { position: 5, name: "Christian Nicolaisen", points: 114 },
    { position: 6, name: "Christian Nicolaisen", points: 112 },
    { position: 7, name: "Christian Nicolaisen", points: 110 },
    { position: 8, name: "Christian Nicolaisen", points: 108 },
    { position: 9, name: "Christian Nicolaisen", points: 106 },
    { position: 10, name: "Christian Nicolaisen", points: 104 },
    { position: 2, name: "Christian Nicolaisen", points: 120 },
    { position: 3, name: "Christian Nicolaisen", points: 118 },
    { position: 4, name: "Christian Nicolaisen", points: 116 },
    { position: 5, name: "Christian Nicolaisen", points: 114 },
    { position: 6, name: "Christian Nicolaisen", points: 112 },
    { position: 7, name: "Christian Nicolaisen", points: 110 },
    { position: 8, name: "Christian Nicolaisen", points: 108 },
    { position: 9, name: "Christian Nicolaisen", points: 106 },
    { position: 10, name: "Christian Nicolaisen", points: 104 }
  ];
  displayedColumns: string[] = ['position', 'name', 'points'];
  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.navbarTitle = "Ranglisten";
  }

}
