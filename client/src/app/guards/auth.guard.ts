import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  path;
  route;

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return true;

    if (this.auth.isLoggedIn()) { return true; }
    this.router.navigate(['login']);
    return false;


  }

}
