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
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private user: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUserByEmail(this.route.snapshot.params.email);
    this.userData = this.formBuilder.group({
      firstName : [null, Validators.required],
      lastName : [null, Validators.required]
    });
  }

  getUserByEmail(email: string) {
    this.user.getUserByEmail(email).subscribe((res: any) => {
      this.email = res.data.email;
      this.userData.setValue({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.user.updateUser(this.email, this.userData.value)
      .subscribe((res: any) => {
          const userEmail = res.data.email;
          this.isLoadingResults = false;
          this.router.navigate(['/user-details', userEmail]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  userDetails() {
    this.router.navigate(['/user-details', this.email]);
  }

}
