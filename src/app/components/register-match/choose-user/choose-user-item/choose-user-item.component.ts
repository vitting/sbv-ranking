import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-choose-user-item',
  templateUrl: './choose-user-item.component.html',
  styleUrls: ['./choose-user-item.component.scss']
})
export class ChooseUserItemComponent implements OnInit {
  @Input() user: User;
  @Input() lastItem = false;
  @Input() highlight = false;
  @Input() showAddButton = true;
  @Output() addUserClick = new EventEmitter<User>();
  src = "";
  showProfile = false;
  constructor(private utilityService: UtilityService) { }

  ngOnInit() {
    if (this.user.photoUrl) {
      this.src = this.user.photoUrl;
    } else {
      this.src = this.utilityService.noProfileImage;
    }
  }

  addUser() {
    this.addUserClick.emit(this.user);
  }
}
