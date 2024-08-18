import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DepartmentModel } from 'src/app/models/DepartmentModel';
import { UserModel } from 'src/app/models/UserModel';
import { DepartmentService } from 'src/app/services/department.service';
import { UserManagementService } from 'src/app/services/user-management.service';


@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {
  departmentName: string = '';
  managerName: string = '';
  roleNames: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewUserComponent>,
    private userService: UserManagementService,
    private departmentService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public user: UserModel
  ) {
    this.loadDepartmentName(user.departmentId);
    this.loadManagerName(user.managerId);
    this.loadRoleNames(user.roleIds);
  }

  loadDepartmentName(departmentId: number) {
    if (departmentId) {
      this.departmentService.getbyid(departmentId).subscribe(
        (department: DepartmentModel) => {
          this.departmentName = department?.name ?? '';
        },
        (error) => {
          console.error('Error loading department name:', error);
        }
      );
    }
  }

  loadManagerName(managerId: number) {
    if (managerId) {
      this.userService.getUserById(managerId).subscribe(
        (user: UserModel) => {
          this.managerName = user?.fullname ?? '';
        },
        (error) => {
          console.error('Error loading manager name:', error);
        }
      );
    }
  }

  loadRoleNames(roleIds: number[] | null | undefined) {
    if (roleIds) {
      const roleLookup: { [key: number]: string } = {
        1: 'admin',
        2: 'qc1',
        3: 'qc2',
        4: 'officer',
        5: 'enduser'
      };
      this.roleNames = roleIds.map(roleId => roleLookup[roleId]);
    }
  }  

  onCancel() {
    this.dialogRef.close();
  }
}
