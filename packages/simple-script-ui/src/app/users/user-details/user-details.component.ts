import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'script', 'runResults'];
  scriptsData = [];
  user = { id: '', firstName: '', lastName: '', email: '' };
  isLoadingResults = false;
  errorRes = { error: false, msg: '' };

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserDetails(this.route.snapshot.params.id);
  }

  getUserDetails(id: string) {
    this.isLoadingResults = true;
    this.userService.getUserById(id)
      .subscribe((res: any) => {
        const { scripts, user } = res.data;
        this.user = user;
        this.scriptsData = scripts;
        this.isLoadingResults = false;
        this.errorRes = { error: false, msg: '' };
      }, (err) => {
        this.isLoadingResults = false;
        this.errorRes = { error: true, msg: err.error.message };
      });
    }

}
