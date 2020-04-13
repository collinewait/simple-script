import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const baseApiUrl = environment.baseApiUrl;

const apiUrl = `${baseApiUrl}/api/v1/users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(apiUrl);
  }

  addUser(user) {
    return this.http.post<any>(apiUrl, user);
  }

  getUserById(userId: string) {
    const url = `${apiUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  updateUser(userId: string, userData) {
    const url = `${apiUrl}/${userId}`;
    return this.http.put(url, userData, httpOptions);
  }
}
