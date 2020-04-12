import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <mat-error *ngIf="errorRes.error">
      {{errorRes.msg}}
    </mat-error>
  `,
  styles: []
})
export class ErrorComponent {
  @Input() errorRes = { error: false, msg: '' };
}
