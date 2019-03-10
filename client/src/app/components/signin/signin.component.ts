import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

import { PRJ } from '../../consts/projectConst';
import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  isLoading = false;
  hide = true;
  userName: string;
  password: string;
  signinFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
    ) {}

  ngOnInit() {
    this.signinFormGroup = this._formBuilder.group({
      userNameCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required]
    });
  }

  onSignin() {
    this.isLoading = true;
    const user = {
      userName: this.userName,
      password: this.password
    };

    this.auth.signin(user)
    .subscribe((data) => {
      this.isLoading = false;
      if (data.success) {
          const config = new MatSnackBarConfig();
          config.panelClass = ['snack-success'];
          config.duration = 5000;
          this.snack.open('Login Successful', 'close', config);
          this.router.navigate(['/viz']);

          this.auth.saveAuth(data.token, data.expiresIn, {username: this.userName} );
      }
    }, (error: any) => {
      this.isLoading = false;
      const config = new MatSnackBarConfig();
      config.panelClass = ['snack-error'];
      config.duration = 5000;
      this.snack.open(error.error.message, 'close', config);
    });


  }

}
