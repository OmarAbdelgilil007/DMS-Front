import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,MatFormField,MatLabel,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {
    this.forgotPasswordForm = this.fb.group({
      userName: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const userName = this.forgotPasswordForm.value.userName;
      this.authService.ForgotPassword(userName).subscribe(response => {
        this.dialogRef.close(this.forgotPasswordForm.value);
      }, error => {

      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
