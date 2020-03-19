import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { ScriptsComponent } from './scripts/scripts.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'scripts', component: ScriptsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
