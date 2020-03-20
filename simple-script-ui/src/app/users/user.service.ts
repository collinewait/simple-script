import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const apiUrl = 'http://localhost:3000/api/v1/users';

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

  getUserByEmail(userEmail: string) {
    const url = `${apiUrl}/${userEmail}`;
    return this.http.get<any>(url);
  }
}
