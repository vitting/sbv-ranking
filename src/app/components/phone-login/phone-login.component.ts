import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { NavbarService } from 'src/app/services/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit {
  loginForm: FormGroup;
  verifyForm: FormGroup;
  activeStep = 1;
  constructor(
    private authService: AuthService,
    private navbarService: NavbarService,
    private router: Router) {
  }

  ngOnInit() {
    this.navbarService.navbarTitle = "Login";
    this.authService.initPhoneLogin();
    const validators = [Validators.required, Validators.max(93999999)];

    if (environment.production) {
      validators.push(Validators.min(20000000));
    } else {
      validators.push(Validators.min(10000000));
    }

    this.loginForm = new FormGroup({
      phonenumber: new FormControl(null, validators)
    });

    this.verifyForm = new FormGroup({
      verifycode: new FormControl(null, [Validators.required])
    });

    this.verifyForm.disable();
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.navbarService.showProgressbar = true;
      const phonenumber = this.loginForm.get("phonenumber").value;
      try {
        const result = await this.authService.sendLoginCode(phonenumber);
        this.loginForm.disable();
        this.activeStep = 2;
        this.verifyForm.enable();
      } catch (error) {
       console.log(error);
      } finally {
        this.navbarService.showProgressbar = false;
      }
    }
  }

  async onVerify() {
    if (this.verifyForm.valid) {
      this.navbarService.showProgressbar = true;
      const code: string = this.verifyForm.get("verifycode").value;
      try {
        const result = await this.authService.verifyCode(code.toString());
        if (result.additionalUserInfo.isNewUser) {
          // this.router.navigate(["/signup"]);
        } else {
          // this.router.navigate(["/"]);
        }
        console.log(result);
      } catch (error) {
        console.log(error);
      } finally {
        this.navbarService.showProgressbar = false;
      }
    }
  }

  logout() {
    this.authService.logout();
  }
}
