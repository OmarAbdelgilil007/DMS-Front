import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule,TranslateModule,FormsModule,MatFormField],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  newPasswordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  hide: boolean = true;
  confirmhide: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService // Inject TranslateService
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      this.authService.changePassword(newPassword).subscribe(
        response => {
          this.toastr.success(this.translate.instant('changePassword.success'), this.translate.instant('success'), {
            closeButton: true
          });
          this.dialogRef.close(false);
        },
        error => {
          this.toastr.error(this.translate.instant('changePassword.error'), this.translate.instant('error'), {
            closeButton: true
          });
        }
      );
    }
  }

  passwordMatchValidator(form: FormGroup): { [s: string]: boolean } | null {
    if (form.get('newPassword')?.value !== form.get('confirmPassword')?.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordFieldType = this.newPasswordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
}