import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userData: FormGroup;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  errorRes = { error: false, msg: '' };

  constructor(
    private auth: AuthService,
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
    this.auth.registerUser(this.userData.value)
      .subscribe(res => {
        this.isLoadingResults = false;
        this.errorRes = { error: false, msg: '' };
        localStorage.setItem('token', res.token);
        localStorage.setItem('is-admin', res.data.isAdmin);
        this.router.navigate(['/scripts']);
      }, err => {
        this.isLoadingResults = false;
        this.errorRes = { error: true, msg: err.error.message };
      });
  }
}
