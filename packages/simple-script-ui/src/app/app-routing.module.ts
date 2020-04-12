import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { ScriptsComponent } from './scripts/scripts.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateScriptComponent } from './scripts/create-script/create-script.component';
import { ScriptDetailsComponent } from './scripts/script-details/script-details.component';
import { EditScriptComponent } from './scripts/edit-script/edit-script.component';
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'signup', component: SignupComponent },
  { path: 'scripts', component: ScriptsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'create-script', component: CreateScriptComponent, canActivate: [AuthGuard] },
  { path: 'script-details/:id', component: ScriptDetailsComponent, canActivate: [AuthGuard] },
  { path: 'edit-script/:id', component: EditScriptComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [AuthGuard]},
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
