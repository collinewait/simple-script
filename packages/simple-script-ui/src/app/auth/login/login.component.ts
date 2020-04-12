import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Router} from '@angular/router';

import { AuthService } from '../auth.service';
import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userData: FormGroup;
  email = '';
  password = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  errorRes = { error: false, msg: '' };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.userData = this.formBuilder.group({
      email : [null, [Validators.required, Validators.email]],
      password : [null, Validators.required]
    });
  }

  checkLoginStatus() {
    if (this.auth.loggedIn()) {
      this.router.navigate(['/scripts']);
    }
  }

  loginUser() {
    this.isLoadingResults = true;
    this.auth.loginUser(this.userData.value).subscribe(
      res => {
        this.isLoadingResults = false;
        this.errorRes = { error: false, msg: '' };
        localStorage.setItem('token', res.token);
        localStorage.setItem('is-admin', res.data.isAdmin);
        this.router.navigate(['/scripts']);
      }, err => {
        this.isLoadingResults = false;
        this.errorRes = { error: true, msg: err.error.message };
      }
    );
  }
}
