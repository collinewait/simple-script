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

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserDetails(this.route.snapshot.params.email);
  }

  getUserDetails(email: string) {
    this.userService.getUserByEmail(email)
      .subscribe((res: any) => {
        const { scripts, ...userData } = res.data;
        this.user = userData;
        this.scriptsData = Object.values(scripts);
        this.isLoadingResults = false;
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      });
    }

}
