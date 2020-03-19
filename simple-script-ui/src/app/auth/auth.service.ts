import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IUser } from '../user.model';

interface RegData {
  email: string;
  password: string;
}

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3000/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

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
}
