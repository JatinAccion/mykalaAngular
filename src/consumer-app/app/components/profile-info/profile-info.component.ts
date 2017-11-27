import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {
  //getUserInfo = JSON.parse(window.localStorage['userInfo']);
  profileInfo: FormGroup;
  phoneRegex: '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;';
  zipCodeRegex: '^\d{5}(?:[-\s]\d{4})?$';
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.profileInfo = this.formBuilder.group({
      "username": [''],
      "firstname": [''],
      "lastname": [''],
      "phoneno": ['', Validators.compose([Validators.pattern(this.phoneRegex), Validators.minLength(10), Validators.maxLength(10)])],
      "email": [''],
      "gender": [''],
      "dteOfBirth": [''],
      "location": ['', Validators.compose([Validators.required, Validators.pattern(this.zipCodeRegex), Validators.minLength(5), Validators.maxLength(5)])]
    });
  }

  onSubmit() {
    console.log(this.profileInfo)
  }

}
