import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarService } from 'src/app/services/navbar.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UtilityService } from 'src/app/services/utility.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-user-details',
  templateUrl: './signup-user-details.component.html',
  styleUrls: ['./signup-user-details.component.scss'],
  animations: [trigger("cropperShow", [
    state("show", style({
      opacity: '1',
      zIndex: "999",
      // height: "100%"
    })),
    state("hide", style({
      opacity: '0',
      zIndex: "-20",
      // height: "0"
    })),
    transition("show => hide", animate(200)),
    transition("hide => show", animate(200))
  ])]
})
export class SignupUserDetailsComponent implements OnInit {
  signupForm: FormGroup;
  imageChangedEvent: Event;
  croppedImage: any = "";
  cropperShowState = "hide";
  profileImage: any = "";
  showProfileImage = false;
  constructor(
    private navbarService: NavbarService,
    private utilityService: UtilityService,
    private firestoreService: FirestoreService,
    private authService: AuthService) { }

  ngOnInit() {
    this.profileImage = this.utilityService.noProfileImage;
    this.croppedImage = this.utilityService.base64TransparentImage;
    this.navbarService.navbarTitle = "Dine oplysninger";
    this.signupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required])
    });
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.navbarService.showProgressbar = true;
      const name = this.signupForm.get("name").value;
      const gender = this.signupForm.get("gender").value;
      let dataUrl = null;
      try {
        if (this.profileImage !== this.utilityService.noProfileImage) {
          dataUrl = await this.firestoreService.uploadProfileImage(this.authService.userId, this.profileImage);
        }

        const result = await this.firestoreService.addUserProfile(this.authService.userId, name, gender, dataUrl);
        const result2 = await this.firestoreService.addUserStat(this.authService.userId);
      } catch (error) {
        console.error(error);
      } finally {
        this.navbarService.showProgressbar = false;
      }
    }
  }

  choosePhoto(event: Event) {
    console.log(event);

    if ((event.target as HTMLInputElement).value) {
      this.navbarService.showProgressbar = true;
      this.imageChangedEvent = event;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event);
  }

  imageLoaded() {}

  cropperReady() {
    this.navbarService.showProgressbar = false;
    this.cropperShowState = "show";
    console.log("cropperReady");
  }
  loadImageFailed() {
    this.navbarService.showProgressbar = false;
    console.log("loadImageFailed");
  }

  async cropAction(action: string) {
    if (action === "save") {
      this.profileImage = this.croppedImage;
      this.showProfileImage = true;
    } else {
      this.profileImage = this.utilityService.noProfileImage;
      this.showProfileImage = false;
    }

    (this.imageChangedEvent.target as HTMLInputElement).value = "";
    this.imageChangedEvent = null;
    this.croppedImage = this.utilityService.base64TransparentImage;
    this.cropperShowState = "hide";
  }

  profileImageClicked() {
    if (this.showProfileImage) {
      this.profileImage = this.utilityService.noProfileImage;
      this.showProfileImage = false;
    }
  }
}
