import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confrim-delete-node',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confrim-delete-node.component.html',
  styleUrl: './confrim-delete-node.component.scss'
})
export class ConfrimDeleteNodeComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfrimDeleteNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}

