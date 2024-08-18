import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteComponent } from 'src/app/core/shared/confirm-delete/confirm-delete.component';
import { environment } from 'src/app/environments/environment.development';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-add-documents',
  standalone: true,
  imports: [TranslateModule,CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-documents.component.html',
  styleUrl: './add-documents.component.scss',
})
export class AddDocumentsComponent implements OnInit {
  documentForm: FormGroup;
  sampleDocument: File | null = null;
  referenceDocument: File | null = null;
  actualDocuments: File[] = [];
  uploadedDocuments: any[] = [];
  baseUrl = environment.DocURL;
  userRole = localStorage.getItem('userRole');
  showUploadControls: any;
  showActualUploadControls: any;
  lastStateId: any;

  @ViewChild('sampleDocumentInput') sampleDocumentInput!: ElementRef;
  @ViewChild('referenceDocumentInput') referenceDocumentInput!: ElementRef;
  @ViewChild('actualDocumentsInput') actualDocumentsInput!: ElementRef;

  constructor(
    private _nodeService: NodeService,
    public dialogRef: MatDialogRef<AddDocumentsComponent>,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.documentForm = this.formBuilder.group({
      nodeId: [data.nodeId, [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadDocuments();
  }

  onSampleDocumentSelected(event: any) {
    this.sampleDocument = event.target.files[0];
  }

  onReferenceDocumentSelected(event: any) {
    this.referenceDocument = event.target.files[0];
  }

  actualDocumentsSelected(event: any) {
    this.actualDocuments = Array.from(event.target.files);
  }

  addDocuments() {
    if (this.documentForm.valid) {
      const { nodeId } = this.documentForm.value;
      const sampleDoc = this.sampleDocument || undefined;
      const referenceDoc = this.referenceDocument || undefined;

      this._nodeService
        .AddDocs(nodeId, sampleDoc, referenceDoc, this.actualDocuments)
        .subscribe(
          (response: any) => {
            this.toastr.success(this.translate.instant('document.addSuccess'), this.translate.instant('success'), { closeButton: true });
            this.loadDocuments();
            this.resetForm();
          },
          (error) => {
            console.error('Error adding documents:', error);
            this.toastr.error(this.translate.instant('document.addError'), this.translate.instant('error'), { closeButton: true });          }
        );
    }
  }

  loadDocuments() {
    const { nodeId } = this.documentForm.value;
    this._nodeService.GetById(nodeId).subscribe(
      (response: any) => {
        this.uploadedDocuments = response.nodeDocuments;
        this.lastStateId = response.lastStateId;

        this.showUploadControls = this.lastStateId === 1;
        this.showActualUploadControls = this.lastStateId === 51;
      },
      (error) => {
        console.error('Error loading documents:', error);
      }
    );
  }

  deleteDocument(docId: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: { name: 'document' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._nodeService.DeleteDoc(docId).subscribe(
          (response) => {
            this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== docId);
            this.toastr.success(this.translate.instant('document.deleteSuccess'), this.translate.instant('success'), { closeButton: true });          },
          (error) => {
            console.error('Error deleting document:', error);
            this.toastr.error(this.translate.instant('document.deleteError'), this.translate.instant('error'), { closeButton: true });          }
        );
      }
    });
  }

  actualDocumentIndex(doc: any): number {
    return this.uploadedDocuments.filter(d => d.type === 3).indexOf(doc) + 1;
  }

  resetForm() {
    this.sampleDocumentInput.nativeElement.value = '';
    this.referenceDocumentInput.nativeElement.value = '';
    this.actualDocumentsInput.nativeElement.value = '';
    this.documentForm.reset({ nodeId: this.data.nodeId });
    this.sampleDocument = null;
    this.referenceDocument = null;
    this.actualDocuments = [];
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}