import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  image = "assets/images/sbv_logo_250x250.png";
  constructor() { }

  ngOnInit() {
  }

}
