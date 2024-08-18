import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-name',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,TranslateModule],
  templateUrl: './confirm-name.component.html',
  styleUrl: './confirm-name.component.scss'
})
export class ConfirmNameComponent {
  enteredName: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    if (this.enteredName.trim().toLowerCase() === this.data.name.trim().toLowerCase()) {
      this.dialogRef.close(true);
    } else {
      this.toastr.error(this.translate.instant('confirmName.incorrectName'), this.translate.instant('error'), {
        closeButton: true
      });

      
    }
  }

}
