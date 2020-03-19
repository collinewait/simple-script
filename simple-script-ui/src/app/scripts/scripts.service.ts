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

  getScriptById(scriptId: string) {
    const url = `${apiUrl}/${scriptId}`;
    return this.http.get<any>(url);
  }

  deleteScript(scriptId: string) {
    const url = `${apiUrl}/${scriptId}`;
    return this.http.delete<any>(url, httpOptions);
  }

  updateScript(scriptId: string, script: any) {
    const url = `${apiUrl}/${scriptId}`;
    return this.http.put(url, script, httpOptions);
  }
}
