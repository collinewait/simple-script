import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { ScriptsComponent } from './scripts/scripts.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateScriptComponent } from './scripts/create-script/create-script.component';
import { ScriptDetailsComponent } from './scripts/script-details/script-details.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'scripts', component: ScriptsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'create-script', component: CreateScriptComponent},
  { path: 'script-details/:id', component: ScriptDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
