import { NodeService } from 'src/app/services/node.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { error } from 'highcharts';
import { ToastrService } from 'ngx-toastr';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss',
})
export class ConfirmationPopupComponent {
  comment = '';
  constructor(
    private toastr: ToastrService,
    private NodeService: NodeService,
    private router: Router,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: '';
      processName: any;
      NodeName: '';
      comment: '';
    }
  ) {}

  submit() {
    if (this.data.processName == 'Delete') {
      this.NodeService.DeleteNode(Number(this.data.id)).subscribe(
        (data: any) => {}
      );
    } else if (this.data.processName == 'Publish') {
      this.NodeService.GetById(Number(this.data.id)).subscribe((data: any) => {
        this.handlePublishState(Number(this.data.id), data.lastStateId);
      });
    } else if (this.data.processName == 'Approve') {
      this.NodeService.GetById(Number(this.data.id)).subscribe((data: any) => {
        this.handleApprovalState(Number(this.data.id), data.lastStateId);
      });
    } else if (this.data.processName == 'Reject') {
      if (this.comment == '') {
        this.toastr.error(this.translate.instant('commentRequired'), this.translate.instant('error'), {
          closeButton: true,
        });
      } else {
        this.NodeService.GetById(Number(this.data.id)).subscribe(
          (data: any) => {
            this.handleRejectionState(Number(this.data.id), data.lastStateId);
          }
        );
      }
    } else if (this.data.processName == 'Finish & Submit') {
      this.NodeService.GetById(Number(this.data.id)).subscribe((data: any) => {
        this.handleFinishState(Number(this.data.id), data.lastStateId);
      });
    }
  }
  handleNodeAction(id: number, actionId: number): void {
    this.NodeService.NodeAction(id, actionId, this.comment).subscribe(
      (response) => {
        if (this.data.processName == 'Publish') {
          this.toastr.success(this.translate.instant('nodePublishedSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        } else if (this.data.processName == 'Approve') {
          this.toastr.success(this.translate.instant('nodeApprovedSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        } else if (this.data.processName == 'Reject') {
          this.toastr.success(this.translate.instant('nodeRejectedSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        } else if (this.data.processName == 'Finish & Submit') {
          this.toastr.success(this.translate.instant('nodeFinishedSubmittedSuccess'), this.translate.instant('success'), {
            closeButton: true,
          });
        }
      },
      (error) => {
        if (this.data.processName == 'Publish') {
          this.toastr.error(this.translate.instant('errorPublish'), this.translate.instant('error'), {
            closeButton: true,
          });
        } else if (this.data.processName == 'Approve') {
          this.toastr.error(this.translate.instant('errorApprove'), this.translate.instant('error'), {
            closeButton: true,
          });
        } else if (this.data.processName == 'Finish & Submit') {
          this.toastr.error(this.translate.instant('errorFinishSubmit'), this.translate.instant('error'), {
            closeButton: true,
          });
        }
      }
    );
  }

  handleApprovalState(id: number, lastStateId: number): void {
    if (lastStateId == 2) {
      this.handleNodeAction(id, 31);
    } else if (lastStateId == 92) {
      this.handleNodeAction(id, 81);
    } else if (lastStateId == 80) {
      this.handleNodeAction(id, 81);
    } else if (lastStateId == 40) {
      this.handleNodeAction(id, 41);
    } else if (lastStateId % 10 == 2) {
      this.handleNodeAction(id, lastStateId + 9);
    } else if (lastStateId % 10 == 1) {
      this.handleNodeAction(id, lastStateId + 10);
    } else {
      this.handleNodeAction(id, 71);
    }
  }

  handleRejectionState(id: number, lastStateId: number): void {
    if (lastStateId == 2) {
      this.handleNodeAction(id, 32);
    } else if (lastStateId == 92) {
      this.handleNodeAction(id, 82);
    } else if (lastStateId == 80) {
      this.handleNodeAction(id, 82);
    } else if (lastStateId == 40) {
      this.handleNodeAction(id, 42);
    } else if (lastStateId % 10 == 2) {
      this.handleNodeAction(id, lastStateId + 10);
    } else if (lastStateId % 10 == 1) {
      this.handleNodeAction(id, lastStateId + 11);
    } else {
      this.handleNodeAction(id, 72);
    }
  }
  handlePublishState(id: number, lastStateId: number): void {
    if (lastStateId == 1) {
      this.handleNodeAction(id, 2);
    } else if (lastStateId == 42) {
      this.handleNodeAction(id, 40);
    }
  }
  handleFinishState(id: number, lastStateId: number): void {
    if (lastStateId == 51) {
      this.handleNodeAction(id, 60);
    } else if (lastStateId == 82) {
      this.handleNodeAction(id, 80);
    }
  }
}
