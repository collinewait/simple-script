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
  errorRes = { error: false, msg: '' };

  constructor(private scpt: ScriptsService, public auth: AuthService) { }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.scpt.getScripts()
    .subscribe((res: any) => {
      this.data = res.data;
      this.errorRes = { error: false, msg: '' };
      this.isLoadingResults = false;
    }, err => {
      this.errorRes = { error: true, msg: err.error.message };
      this.isLoadingResults = false;
    });
  }

}
