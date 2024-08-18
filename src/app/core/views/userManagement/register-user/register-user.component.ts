import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleModel } from 'src/app/models/RoleModel';
import { DepartmentModel } from 'src/app/models/DepartmentModel';
import { UserModel } from 'src/app/models/UserModel';
import { DepartmentService } from 'src/app/services/department.service';
import { RoleService } from 'src/app/services/role.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { Role } from 'src/app/models/IRole';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    NgSelectModule,
    TranslateModule
  ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent implements OnInit {
  departments: DepartmentModel[] = [];
  users: UserModel[] = [];
  roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'qc1' },
    { id: 3, name: 'qc2' },
    { id: 4, name: 'officer' },
    { id: 5, name: 'enduser' },
  ];
  userForm!: FormGroup;
  userId: number | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserManagementService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<RegisterUserComponent>,
    private toastr: ToastrService,
    private translate: TranslateService, // Inject TranslateService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userId = data?.id ? Number(data.id) : null;
    this.isEditMode = !!this.userId;
  }

  ngOnInit(): void {
    this.createForm();
    this.loadDepartments();
    this.loadUsers();
    if (this.isEditMode && this.userId) {
      this.loadUserData();
    }
  }

  createForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      passwordHash: [
        '',
        this.isEditMode ? Validators.nullValidator : Validators.required,
      ],
      fullname: ['', Validators.required],
      phone: [''],
      email: ['', Validators.required],
      address: [''],
      departmentId: ['', Validators.required],
      managerId: [''],
      roleIds: new FormControl('',Validators.required),
    });
  }

  loadDepartments() {
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

  loadUsers() {
    this.userService.GetUserList(1, '').subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          this.users = response.items as UserModel[];
        } else {
          console.error('Invalid response format for users:', response);
        }
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadUserData() {
    if (this.userId !== null) {
      this.userService.getUserById(this.userId).subscribe(
        (user: any) => {
          this.userForm.patchValue(user);
          this.userForm
            .get('managerId')
            ?.setValue(user.managerId ? user.managerId : null);
          this.userForm
            .get('roleIds')
            ?.setValue(user.userRoles.map((role: Role) => role.roleId));
        },
        (error) => {
          console.error('Error loading user data:', error);
        }
      );
    } else {
      console.error('User ID is null.');
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      let phoneValue = this.userForm.get('phone')?.value;
      if (phoneValue === '') {
        phoneValue = null;
      }
      const userData: UserModel = {
        id: this.userId !== null ? this.userId.toString() : undefined,
        username: this.userForm.get('username')?.value,
        passwordHash: this.userForm.get('passwordHash')?.value,
        fullname: this.userForm.get('fullname')?.value,
        phone: phoneValue,
        email: this.userForm.get('email')?.value,
        address: this.userForm.get('address')?.value,
        departmentId: this.userForm.get('departmentId')?.value,
        managerId: this.userForm.get('managerId')?.value
          ? this.userForm.get('managerId')?.value
          : null,
        roleIds: this.userForm.get('roleIds')?.value,
      };
      if (this.isEditMode) {
        this.userService.Update(userData).subscribe(
          (response) => {
            this.toastr.success(this.translate.instant('registerUser.success.updated'), this.translate.instant('success'), {
              closeButton: true
            });
            this.dialogRef.close(true);
          },
          (error) => {
            this.toastr.error(this.translate.instant('registerUser.error.updateFailed'), this.translate.instant('error'), {
              closeButton: true
            });
          }
        );
      } else {
        this.userService.registerUser(userData).subscribe(
          (response) => {
            this.toastr.success(this.translate.instant('registerUser.success.added'), this.translate.instant('success'), {
              closeButton: true
            });
            this.dialogRef.close(true);
          },
          (error) => {
            this.toastr.error(this.translate.instant('registerUser.error.registrationFailed'), this.translate.instant('error'), {
              closeButton: true
            });
          }
        );
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}