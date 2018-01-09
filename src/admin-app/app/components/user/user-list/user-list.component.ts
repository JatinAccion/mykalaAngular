import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../../../../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./../user.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  users: Array<User>;
  isCollapsed = true;
  constructor(private userService: UserService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.userService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.users.push(new User(obj)); });
    });
  }
}
