import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-signup-user-details',
  templateUrl: './signup-user-details.component.html',
  styleUrls: ['./signup-user-details.component.scss']
})
export class SignupUserDetailsComponent implements OnInit {
  signupForm: FormGroup;
  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.navbarTitle = "Dine oplysninger";
    this.signupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const name = this.signupForm.get("name").value;
      const gender = this.signupForm.get("gender").value;
      console.log(name, gender);

    }
  }

  uploadPhoto(event) {

  }
}
