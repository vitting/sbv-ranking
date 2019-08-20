import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Pipe({
  name: 'profilePicOfUser'
})
export class ProfilePicOfUserPipe implements PipeTransform {
  constructor(private authService: AuthService, private utilityService: UtilityService) {}
  transform(value: any, ...args: any[]): any {
    const user = this.authService.getUserInfo(value);

    if (user && user.photoUrl) {
      return user.photoUrl;
    } else {
      return this.utilityService.noProfileImage;
    }
  }

}
