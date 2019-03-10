import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PRJ } from '../../consts/projectConst';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  domain = PRJ.DOMAIN;


  authToken: string;
  authUserName: string;

  constructor(private http: HttpClient) { }

  saveAuth(token: string, expiresInSec: string, user: Object) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresInSec', expiresInSec);
    const now = new Date();
    const expirationDate = new Date( now.getTime() + Number(expiresInSec) * 1000 );
    localStorage.setItem('expiresInDate', expirationDate.toISOString() );

    this.authToken = token;
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresInSec');
    localStorage.removeItem('expiresInDate');

    this.authToken = null;
    this.authUserName = null;
  }


  fetchToken() {
    this.authToken = localStorage.getItem('token');
    return this.authToken;
  }


  isLoggedIn() {
    if ( !this.fetchToken() ) { return false; }
    // check if expired
    const expiresInDate = new Date(localStorage.getItem('expiresInDate'));
    const now = new Date();
    if (now > expiresInDate) { return false; }

    return true;
  }


  signup(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<{success: boolean, message: string}>(`${this.domain}/user/signup`, user, {headers: headers} )
}


signin(user) {
  let headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  return this.http.post<{success: boolean,
                        message: string,
                        token: string,
                        expiresIn: string}>(`${this.domain}/user/signin`, user, {headers: headers} )
}



signout() {
  this.clearAuth();
}


getProfile() {
  return this.http.get(`${this.domain}/user/profile`)
}

}
