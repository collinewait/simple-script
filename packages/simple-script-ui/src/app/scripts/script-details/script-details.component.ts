import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ScriptsService } from '../scripts.service';

@Component({
  selector: 'app-script-details',
  templateUrl: './script-details.component.html',
  styleUrls: ['./script-details.component.scss']
})
export class ScriptDetailsComponent implements OnInit {
  script = { id: '', script: '', runResults: '', updated: null };
  isLoadingResults = false;
  errorRes = { error: false, msg: '' };

  constructor(
    private scpt: ScriptsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getScriptDetails(this.route.snapshot.params.id);
  }

  getScriptDetails(id: string) {
    this.isLoadingResults = true;
    this.scpt.getScriptById(id)
      .subscribe((res: any) => {
        this.script = {
          ...res.data,
          script: this.escapeNewline(res.data.script),
          runResults: res.data.runResults.toString(),
        };
        this.errorRes = { error: false, msg: '' };
        this.isLoadingResults = false;
      }, (err) => {
        this.errorRes = { error: true, msg: err.error.message };
        this.isLoadingResults = false;
      });
  }

  deleteScript(id: any) {
    this.isLoadingResults = true;
    this.scpt.deleteScript(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          this.errorRes = { error: false, msg: '' };
          this.router.navigate(['/scripts']);
        }, (err) => {
          this.errorRes = { error: true, msg: err.error.message };
          this.isLoadingResults = false;
        }
      );
    }

  runScript(id: any) {
    this.isLoadingResults = true;
    this.scpt.runScript(id)
      .subscribe((res: any) => {
        this.script = {...res.data, script: this.escapeNewline(res.data.script)};
        this.isLoadingResults = false;
        this.errorRes = { error: false, msg: '' };
        }, (err) => {
          this.errorRes = { error: true, msg: err.error.message };
          this.isLoadingResults = false;
        }
      );
  }

  escapeNewline(script: string) {
    return script.replace(/\n/g, '\\n');
  }
}
