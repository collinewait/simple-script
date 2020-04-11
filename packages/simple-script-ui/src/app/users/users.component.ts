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
  constructor(private user: UserService) { }

  ngOnInit(): void {
    this.user.getUsers()
    .subscribe((res: any) => {
      this.data = res.data;
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

}
