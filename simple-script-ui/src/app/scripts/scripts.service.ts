import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3000/api/v1/scripts';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  constructor(private http: HttpClient) { }

  getScripts() {
    return this.http.get<any>(apiUrl);
  }

  createScript(script) {
    return this.http.post<any>(apiUrl, script);
  }
}
