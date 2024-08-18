import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserManagementService,
    private toastr: ToastrService,
    private translate: TranslateService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onDelete() {
    const userId = this.data.id;
    this.userService.delete(userId).subscribe(
      (response) => {
        this.toastr.warning(this.translate.instant('deleteUser.warning.deleted'), this.translate.instant('warning'), {
          closeButton: true
        });
        this.dialogRef.close(true);
      },
      (error) => {
        this.toastr.error(this.translate.instant('deleteUser.error.notDeleted'), this.translate.instant('error'), {
          closeButton: true
        });
        this.dialogRef.close(true);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
