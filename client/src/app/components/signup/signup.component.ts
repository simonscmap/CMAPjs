import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  isLinear = true;
  hide = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;

  minUserNameLen = 4;
  minPasswordLen = 6;

  constructor(private _formBuilder: FormBuilder,
              private auth: AuthService,
              private snack: MatSnackBar,
              private router: Router
              ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required]
    });


    this.secondFormGroup = this._formBuilder.group({
      userNameCtrl: ['', [Validators.required, Validators.minLength(this.minUserNameLen)] ],
      passwordCtrl: ['', [Validators.required, Validators.pattern(`^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){${this.minPasswordLen},}$`)] ]
    });

    this.thirdFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email] ]
    });

  }

  onSubmit() {

    // let newUser: UserInterface;
    // newUser.firstName = this.firstName.trim();
    // newUser.lastName = this.lastName.trim();
    // newUser.userName = this.userName.trim();
    // newUser.password = this.password.trim();
    // newUser.email = this.email.trim();

    // const newUser: UserInterface = {
    //   firstName : this.firstName.trim(),
    //   lastName : this.lastName.trim(),
    //   userName : this.userName.trim(),
    //   password : this.password.trim(),
    //   email : this.email.trim(),
    // };


    this.isLoading = true;
    const newUser = {
      firstName : this.firstName.trim(),
      lastName : this.lastName.trim(),
      userName : this.userName.trim(),
      password : this.password.trim(),
      email : this.email.trim(),
    }

    this.auth.signup(newUser)
    .subscribe((data) => {
      this.isLoading = false;
      if (data.success) {
          const config = new MatSnackBarConfig();
          config.panelClass = ['snack-success'];
          this.snack.open(`Successful registration, please sign in.`, 'close', config);
          this.router.navigate(['login']);

      } else {
        const config = new MatSnackBarConfig();
        config.panelClass = ['snack-error'];
        this.snack.open(data.message, 'close', config);
      }

    }, (error: any) => {
      this.isLoading = false;
      const config = new MatSnackBarConfig();
      config.panelClass = ['snack-error'];
      this.snack.open(error.error.message, 'close', config);
    });

  }


  get firstNameGetter() { return this.firstFormGroup.get('firstNameCtrl'); }
  get lastNameGetter() { return this.firstFormGroup.get('lastNameCtrl'); }
  get userNameGetter() { return this.secondFormGroup.get('userNameCtrl'); }
  get passwordGetter() { return this.secondFormGroup.get('passwordCtrl'); }
  get emailGetter() { return this.thirdFormGroup.get('emailCtrl'); }



}
