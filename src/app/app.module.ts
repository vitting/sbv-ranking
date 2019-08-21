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
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {MatRippleModule} from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faUser,
  faSignOutAlt,
  faCog,
  faCalendarDay,
  faUserPlus,
  faInfoCircle,
  faVolleyballBall,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendar
} from '@fortawesome/free-regular-svg-icons';
import 'moment/locale/da';
import { MomentModule } from 'ngx-moment';
import { SplashScreenComponent } from './components/shared/splash-screen/splash-screen.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RankingDetailsComponent } from './components/ranking-details/ranking-details.component';
import { FabButtonComponent } from './components/shared/fab-button/fab-button.component';
import { SignupUserDetailsComponent } from './components/signup-user-details/signup-user-details.component';
import { RegisterMatchComponent } from './components/register-match/register-match.component';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ChoseUserComponent } from './components/register-match/choose-user/choose-user.component';
import { ChooseUserItemComponent } from './components/register-match/choose-user/choose-user-item/choose-user-item.component';
import { ErrorMessageComponent } from './components/shared/error-message/error-message.component';
import { NameOfUserPipe } from './components/shared/pipes/name-of-user.pipe';
import { ProfilePicOfUserPipe } from './components/shared/pipes/profile-pic-of-user.pipe';
import { RankingDetailsMatchesComponent } from './components/ranking-details-matches/ranking-details-matches.component';

export const DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    NameOfUserPipe,
    ProfilePicOfUserPipe,
    PhoneLoginComponent,
    SplashScreenComponent,
    HomeComponent,
    NavbarComponent,
    RankingDetailsComponent,
    FabButtonComponent,
    SignupUserDetailsComponent,
    RegisterMatchComponent,
    ChoseUserComponent,
    ChooseUserItemComponent,
    ErrorMessageComponent,
    RankingDetailsMatchesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebaseConfig.firebase, 'sbv-ranking'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    MomentModule,
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatRadioModule,
    MatProgressBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRippleModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'da-DK' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faCog,
      faCalendar,
      faCalendarDay,
      faUser,
      faPlus,
      faUserPlus,
      faInfoCircle,
      faTrophy,
      faVolleyballBall,
      faSignOutAlt);
  }
}
