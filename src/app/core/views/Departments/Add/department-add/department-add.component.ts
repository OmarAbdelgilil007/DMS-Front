import { DepartmentService } from './../../../../../services/department.service';
import { DepartmentModel } from './../../../../../models/DepartmentModel';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'department-add',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule,MatDialogModule,TranslateModule],
  templateUrl: './department-add.component.html',
  styleUrl: './department-add.component.css'
})
export class DepartmentAddComponent implements OnInit {
  
 
  departmentForm: FormGroup;
  departments: DepartmentModel[] = [];
  submitted = false;
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DepartmentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.isEditMode = data && data.id ? true : false;

    this.departmentForm = this.formBuilder.group({
      id: [data ? data.id : null],
      name: [data ? data.name : '', Validators.required],
      parentId: [data ? data.parentId : null]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.GetDepartments().subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          this.departments = response.items as DepartmentModel[];
        } else {
          console.error('Invalid response format for departments:', response);
        }
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.departmentForm.valid) {
      if (this.isEditMode) {
        this.departmentService.Update(this.departmentForm.value).subscribe(
          (res: any) => {
            this.toastr.success(this.translate.instant('Department.success.updated'), this.translate.instant('success'), {
              closeButton: true
            });
            this.dialogRef.close(this.departmentForm.value);
          },
          (error) => {
            if (error.status === 500) {
              var errorMessage = error.error.message;
              if (errorMessage === "DuplicatedItem")
                errorMessage = this.translate.instant('Department.error.duplicateName');
              this.toastr.error(errorMessage, this.translate.instant('error'), {
                closeButton: true
              });
            } else {
              this.toastr.error(this.translate.instant('Department.error.failedToUpdate'), this.translate.instant('error'), {
                closeButton: true
              });
            }
          }
        );
      } else {
        this.departmentService.AddDepartments(this.departmentForm.value as DepartmentModel).subscribe(
          (res: any) => {
            this.toastr.success(this.translate.instant('Department.success.added'), this.translate.instant('success'), {
              closeButton: true
            });
            this.dialogRef.close(this.departmentForm.value);
          },
          (error) => {
            if (error.status === 500) {
              var errorMessage = error.error.message;
              if (errorMessage === "DuplicatedItem")
                errorMessage = this.translate.instant('Department.error.duplicateName');
              this.toastr.error(errorMessage, this.translate.instant('error'), {
                closeButton: true
              });
            } else {
              this.toastr.error(this.translate.instant('Department.error.failedToAdd'), this.translate.instant('error'), {
                closeButton: true
              });
            }
          }
        );
      }
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }
}