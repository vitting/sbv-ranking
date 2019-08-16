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
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faTimesCircle,
  faTasks,
  faPlus,
  faUser,
  faUsers,
  faEdit,
  faHome,
  faSignInAlt,
  faSignOutAlt,
  faArrowLeft,
  faCircle,
  faExclamationCircle,
  faChevronCircleRight,
  faCog,
  faDirections,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons';
import {
  faComment,
  faCalendar,
  faTrashAlt,
  faLightbulb,
  faClipboard,
  faCheckSquare,
  faSquare,
  faQuestionCircle,
  faCalendarAlt,
  faCalendarPlus,
  faFileAlt
} from '@fortawesome/free-regular-svg-icons';
import 'moment/locale/da';
import { MomentModule } from 'ngx-moment';
import { SplashScreenComponent } from './components/shared/splash-screen/splash-screen.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RankingDetailsComponent } from './components/ranking-details/ranking-details.component';
import { FabButtonComponent } from './components/shared/fab-button/fab-button.component';
import { SignupUserDetailsComponent } from './components/signup-user-details/signup-user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    PhoneLoginComponent,
    SplashScreenComponent,
    HomeComponent,
    NavbarComponent,
    RankingDetailsComponent,
    FabButtonComponent,
    SignupUserDetailsComponent
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
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faTimesCircle,
      faComment,
      faCog,
      faTasks,
      faCalendar,
      faCalendarDay,
      faUser,
      faPlus,
      faLightbulb,
      faSignInAlt,
      faCalendarAlt,
      faCalendarPlus,
      faEdit,
      faCheckSquare,
      faSquare,
      faClipboard,
      faHome,
      faTrashAlt,
      faUsers,
      faArrowLeft,
      faCircle,
      faQuestionCircle,
      faChevronCircleRight,
      faExclamationCircle,
      faFileAlt,
      faDirections,
      faFileAlt,
      faSignOutAlt);
  }
}
