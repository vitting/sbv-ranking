import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SplashService } from './services/splash.service';
import { fadeAnimation } from './components/shared/animations/page-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  showSplash = true;
  constructor(private authService: AuthService, private splashService: SplashService) {}

  ngOnInit(): void {
    this.splashService.splashScreenChanges$.subscribe((show) => {
      this.showSplash = show;
    });
  }

}
