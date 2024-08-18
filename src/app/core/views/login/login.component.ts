import { ForgotPasswordComponent } from './../userManagement/forgot-password/forgot-password.component';
import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  ToasterService,
  SharedModule,
} from '@coreui/angular';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/LoginModel';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [SharedModule,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,ReactiveFormsModule,CommonModule],
   
  })
  export class LoginComponent {
    hide: boolean = true;
    submitted = false;
    isLoggedIn = false;
    isLoading = false;
  
    loginModel: LoginModel = {
      username: '',
      password: ''
    };
  
    loginForm = new FormGroup({
      username: new FormControl(this.loginModel.username, [Validators.required]),
      password: new FormControl(this.loginModel.password, [Validators.required])
    });
  
    constructor(
      private service: AuthService,
      private router: Router,
      private toastr: ToastrService,
      private dialog: MatDialog,
      private _TranslateService: TranslateService,
    ) {
      
    }
  
    onSubmit() {
      this.submitted = true;
      if (this.loginForm.valid) {
        this.isLoading = true;
        this.service.login(this.loginForm.value as LoginModel).subscribe({
          next: (res: any) => {
            this.service.setUserInfo(res.token, res.roleSlug, res.fullname);
            this.router.navigate(['/dashboard']);
  
            localStorage.setItem('userToken', res.token);
            localStorage.setItem('userEmail', res.email);
            localStorage.setItem('userRole', res.roleSlug);
            localStorage.setItem('userName', res.fullname);
            localStorage.setItem('lang', 'en');
  
            if (!this.isLoggedIn) {
              this.getProfile();
              this.isLoggedIn = true;
            }
          },
          error: (err: any) => {
            this.toastr.error(
              'Login failed. Please check your credentials and try again.',
              'Error', {
                closeButton: true
            });
            this.isLoading = false;
          },
          complete: () => {
            if (this.isLoggedIn) {
              this.toastr.success(
                `Welcome, ${localStorage.getItem('userName')}! You have successfully logged in.`,
                'Login Successfully',
                {
                  closeButton: true
              });
            }
            this.isLoading = false;
          }
        });
      } else {
        this.toastr.warning('Please fill in all required fields.', 'Warning', {
          closeButton: true
        });
      }
    }
  
    getProfile() {
      const profile = this.service.getProfile();
      if (profile) {
        console.log(profile);
        this.service.getRole();
      }
    }
  
    openForgotPasswordDialog() {
      const username = this.loginForm.get('username')?.value;
      if (username) {
        this.service.ForgotPassword(username).subscribe({
          next: (res: any) => {
            this.toastr.success('Password reset instructions have been sent to your email (given your username is correct).', 'Success', {
              closeButton: true
            });
          },
          error: (err: any) => {
            this.toastr.success('Password reset instructions have been sent to your email (given your username is correct).', 'Success', {
              closeButton: true
            });
          }
        });
      } else {
        this.toastr.warning('Please enter your username first.', 'Warning', {
          closeButton: true
        });
      }
    }
  }
  

