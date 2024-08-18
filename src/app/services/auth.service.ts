import { jwtDecode } from 'jwt-decode';
import { environment } from './../environments/environment.development';
import { LoginModel } from './../models/LoginModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  role : string | any = '';
  userRole = localStorage.getItem('userRole')

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(model: LoginModel) {
    let url = `${environment.URL}/User/login`;
    return this.http.post(url, model, this.httpOptions);
  }
  logout() {
    let url = `${environment.URL}/User/logout`;
    return this.http.post(url, this.httpOptions);
  }

  setUserInfo(token: string, role: string, fullname: string) {
    
    this.deleteCookie("tkn");
    this.deleteCookie("rl");
    this.deleteCookie("usrname");

    this.setCookie("tkn", "Bearer " + token, 1);
    this.setCookie("rl", role, 1);
    this.setCookie("usrname", fullname, 1);
  }


  getUserToken() {
    return this.getCookie("tkn");
  }

  getUserRole() {
    return this.getCookie("rl");
  }

  getUsername() {
    return this.getCookie("usrname");
  }


  isLoggedIn(): boolean {
    //&& this.getCookie("rl") == "admin"
    if (this.getCookie("tkn")) {
      return true;
    }
    return false;
  }

  private setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }
  Profile(token: string, role: string, fullname: string,email:string): void {
    localStorage.setItem('userToken', token);
    const decodedToken: any = jwtDecode(token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userFullName', fullname);
    localStorage.setItem('userEmail', email);
  }

  getProfile(): any {
    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    }
    return null;
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  changePassword(newPassword: string) {
    const payload = { newPassword };
    return this.http.post(`${environment.URL}/User/ChangePassword`, payload, { responseType: 'text' });
  }

  ForgotPassword(Username: string) {
    const payload = { Username };
    return this.http.post(`${environment.URL}/User/ForgetPassword`, payload, { responseType: 'text' });
  }

    
  


}
