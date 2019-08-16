import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneLoginComponent } from './components/phone-login/phone-login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupUserDetailsComponent } from './components/signup-user-details/signup-user-details.component';


const routes: Routes = [{
  path: "",
  component: HomeComponent,
}, {
  path: "login",
  component: PhoneLoginComponent,
}, {
  path: "profile",
  component: SignupUserDetailsComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
