import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { ScriptsService } from '../scripts.service';
import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';
import { InvalidScript } from '../script.validator';

@Component({
  selector: 'app-edit-script',
  templateUrl: './edit-script.component.html',
  styleUrls: ['./edit-script.component.scss']
})
export class EditScriptComponent implements OnInit {
  scriptForm: FormGroup;
  id = '';
  script = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scpt: ScriptsService,
    private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      this.getScriptById(this.route.snapshot.params.id);
      this.scriptForm = this.formBuilder.group({
        script : [null, [Validators.required, InvalidScript]]
      });
    }

    getScriptById(id: any) {
      this.scpt.getScriptById(id).subscribe((res: any) => {
        this.id = res.data._id;
        this.scriptForm.setValue({
          script: res.data.script.replace(/\n/g, '\\n')
        });
      });
    }

    onFormSubmit() {
      this.isLoadingResults = true;
      const data = { script: this.scriptForm.value.script.replace(/\\n/g, '\n') };
      this.scpt.updateScript(this.id, data)
        .subscribe((res: any) => {
            const scriptId = res.data._id;
            this.isLoadingResults = false;
            this.router.navigate(['/script-details', scriptId]);
          }, (err: any) => {
            console.log(err);
            this.isLoadingResults = false;
          }
        );
    }

    scriptDetails() {
      this.router.navigate(['/script-details', this.id]);
    }
}
