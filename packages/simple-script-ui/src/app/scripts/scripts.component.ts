import { Component, OnInit } from '@angular/core';

import { ScriptsService } from './scripts.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'script', 'runResults'];
  data = [];
  isLoadingResults = false;
  constructor(private scpt: ScriptsService, public auth: AuthService) { }

  ngOnInit(): void {
    this.scpt.getScripts()
    .subscribe((res: any) => {
      this.data = Object.values(res.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

}
