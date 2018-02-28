import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserProfile } from '../../../../../models/user';
import { UserService } from '../user.service';
import { Alert } from '../../../../../models/IAlert';
import { userMessages } from './messages';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./../user.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  users: Array<UserProfile>;
  // currentPage = 0;
  isCollapsed = true;
  username = ''; p = 0;
  constructor(private userService: UserService, public core: CoreService) {
    this.users = new Array<UserProfile>();
  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.userService.get(null).subscribe((res) => {
      this.users = res;
    });
  }
  userFilter(username) {
    return this.users.filter(p => p.username.indexOf(username) > -1);
  }
  deleteUser(user) {
    const msg = new Alert(userMessages.deleteConfirmation, 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        this.userService.delete(user.userId).subscribe(p => {
          this.core.message.success(userMessages.deleted);
          this.users.splice(this.users.indexOf(user), 1);
        });
      }
    });
  }
}
