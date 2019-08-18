import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneLoginComponent } from './components/phone-login/phone-login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupUserDetailsComponent } from './components/signup-user-details/signup-user-details.component';
import { RegisterMatchComponent } from './components/register-match/register-match.component';
import { ChoseUserComponent } from './components/register-match/choose-user/choose-user.component';


const routes: Routes = [{
  path: "",
  component: HomeComponent,
}, {
  path: "matchs/add",
  component: RegisterMatchComponent,
}, {
  path: "matchs/users",
  component: ChoseUserComponent,
}, {
  path: "login",
  component: PhoneLoginComponent,
}, {
  path: "profile",
  component: SignupUserDetailsComponent,
}, {
  path: "**",
  component: PhoneLoginComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
