import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { InvalidOps } from '../script.validator';
import { MyErrorStateMatcher } from '../../common/my-error-state-matcher';
import { ScriptsService } from '../scripts.service';

@Component({
  selector: 'app-create-script',
  templateUrl: './create-script.component.html',
  styleUrls: ['./create-script.component.scss']
})
export class CreateScriptComponent implements OnInit {
  scriptForm: FormGroup;
  operations = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private scpt: ScriptsService) { }

    ngOnInit(): void {
    this.scriptForm = this.formBuilder.group({
      operations : [null, [Validators.required, InvalidOps]],
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    const ops = this.scriptForm.value.operations.split(',');
    const trimedOps = ops.map(o => o.trim());
    this.scpt.createScript({operations: trimedOps}).subscribe(
      res => {
        const id = res.data.id;
        this.isLoadingResults = false;
        this.router.navigate(['/script-details', id]);
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

}
