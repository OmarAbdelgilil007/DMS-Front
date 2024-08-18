import { UserManagementService } from 'src/app/services/user-management.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule,TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserManagementService,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    private translate: TranslateService, // Inject TranslateService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    if (this.resetPasswordForm.valid) {
      const userId = this.data.userId;
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      this.userService.resetPassword(userId, newPassword).subscribe(
        response => {
          this.toastr.success(this.translate.instant('resetPassword.success'), this.translate.instant('success'), {
            closeButton: true
          });
          this.dialogRef.close(true);
        },
        error => {
          this.toastr.error(this.translate.instant('resetPassword.error'), this.translate.instant('error'), {
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

}
