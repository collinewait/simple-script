import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { IUser } from '../user.model';
import { environment } from '../../environments/environment';

interface RegData {
  email: string;
  password: string;
}

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const baseApiUrl = environment.baseApiUrl;

const apiUrl = `${baseApiUrl}/api/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: IUser) {
    return this.http.post<any>(`${apiUrl}/signup`, user);
  }

  loginUser(user: RegData) {
    return this.http.post<any>(`${apiUrl}/login`, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('is-admin');
    this.router.navigate(['/login']);
  }

  isAdmin() {
    return localStorage.getItem('is-admin') === 'true' ? true : false;
  }
}
