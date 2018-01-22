import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserProfile } from '../../../../../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./../user.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  users: Array<UserProfile>;
  isCollapsed = true;
  constructor(private userService: UserService) {
    this.users = new Array<UserProfile>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    // this.userService.get(null).subscribe((res) => {
    //   return res.forEach(obj => { this.users.push(new User(obj)); });
    // });
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
    this.users.push(new UserProfile({ email: 'test' + this.users.length + '@gmail.com', username: 'test' + this.users.length, firstname: 'test' + this.users.length, lastname: 'last' + this.users.length, phone: '998877665' + this.users.length, roleType: 'role' + this.users.length }));
  }
}
