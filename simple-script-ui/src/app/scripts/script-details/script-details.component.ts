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

  constructor(
    private scpt: ScriptsService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit(): void {
      this.getScriptDetails(this.route.snapshot.params.id);
    }

    getScriptDetails(id: string) {
      this.scpt.getScriptById(id)
        .subscribe((res: any) => {
          this.script = res.data;
          console.log(this.script);
          this.isLoadingResults = false;
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        });
    }

    deleteScript(id: any) {
      this.isLoadingResults = true;
      this.scpt.deleteScript(id)
        .subscribe(res => {
            this.isLoadingResults = false;
            this.router.navigate(['/scripts']);
          }, (err) => {
            console.log(err);
            this.isLoadingResults = false;
          }
        );
      }
}