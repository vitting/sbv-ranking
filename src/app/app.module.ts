import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { firebaseConfig } from 'src/environments/firebase-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoneLoginComponent } from './components/phone-login/phone-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import 'moment/locale/da';
import { MomentModule } from 'ngx-moment';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RankingDetailsComponent } from './components/ranking-details/ranking-details.component';
import { FabButtonComponent } from './components/fab-button/fab-button.component';

@NgModule({
  declarations: [
    AppComponent,
    PhoneLoginComponent,
    SplashScreenComponent,
    HomeComponent,
    NavbarComponent,
    RankingDetailsComponent,
    FabButtonComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebaseConfig.firebase, 'sbv-ranking'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MomentModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
