import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import { UserService } from '../user.service';
import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userData: FormGroup;
  firstName = '';
  lastName = '';
  email = '';
  id = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  errorRes = { error: false, msg: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private user: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUserById(this.route.snapshot.params.id);
    this.userData = this.formBuilder.group({
      firstName : [null, Validators.required],
      lastName : [null, Validators.required]
    });
  }

  getUserById(id: string) {
    this.isLoadingResults = true;
    this.user.getUserById(id).subscribe((res: any) => {
      this.id = res.data.user.id;
      this.userData.setValue({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
      });
      this.isLoadingResults = false;
      this.errorRes = { error: false, msg: '' };
    }, (err: any) => {
        this.errorRes = { error: true, msg: err.error.message };
        this.isLoadingResults = false;
      }
    );
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.user.updateUser(this.id, this.userData.value)
      .subscribe((res: any) => {
          const userId = res.data.id;
          this.isLoadingResults = false;
          this.errorRes = { error: false, msg: '' };
          this.router.navigate(['/user-details', userId]);
        }, (err: any) => {
          this.errorRes = { error: true, msg: err.error.message };
          this.isLoadingResults = false;
        }
      );
  }

  userDetails() {
    this.router.navigate(['/user-details', this.id]);
  }

}
