import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment.development';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-view-docs-node',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './view-docs-node.component.html',
  styleUrl: './view-docs-node.component.scss',
})
export class ViewDocsNodeComponent {
  nodeDetails: any;
  baseUrl: string = environment.URL;

  constructor(
    public dialogRef: MatDialogRef<ViewDocsNodeComponent>,
    private toastr: ToastrService,
    private nodeService: NodeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log(this.data);

    this.getNodeDetails();
  }

  getNodeDetails() {
    this.nodeService.GetNodeById(this.data).subscribe(
      (response) => {
        this.nodeDetails = response;
      },
      (error) => {
        this.toastr.error('Error fetching node details', 'Error', {
          closeButton: true,
        });
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
