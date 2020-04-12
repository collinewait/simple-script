import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns = ['id', 'firstName', 'lastName', 'email'];
  data = [];
  isLoadingResults = false;
  errorRes = { error: false, msg: '' };

  constructor(private user: UserService) { }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.user.getUsers()
    .subscribe((res: any) => {
      this.data = res.data;
      this.isLoadingResults = false;
      this.errorRes = { error: false, msg: '' };
    }, err => {
      this.isLoadingResults = false;
      this.errorRes = { error: true, msg: err.error.message };
    });
  }

}
