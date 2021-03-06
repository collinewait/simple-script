import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userData: FormGroup;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  errorRes = { error: false, msg: '' };

  constructor(
    private user: UserService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.userData = this.formBuilder.group({
      firstName : [null, Validators.required],
      lastName : [null, Validators.required],
      email : [null, [Validators.required, Validators.email]],
      password : [null, Validators.required]
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.user.addUser(this.userData.value)
      .subscribe(res => {
        const id = res.data.id;
        this.isLoadingResults = false;
        this.errorRes = { error: false, msg: '' };
        this.router.navigate(['/user-details', id]);
      }, err => {
        this.isLoadingResults = false;
        this.errorRes = { error: true, msg: err.error.message };
      });
  }

}
