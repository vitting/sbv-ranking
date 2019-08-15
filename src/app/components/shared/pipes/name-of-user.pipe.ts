import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Pipe({
  name: 'nameOfUser'
})
export class NameOfUserPipe implements PipeTransform {
  constructor(private authService: AuthService) {}
  transform(value: any, ...args: any[]): any {
    // const user = this.authService.getUserInfo(value);

    // if (user) {
    //   return user.name;
    // } else {
    //   return "";
    // }
  }

}
