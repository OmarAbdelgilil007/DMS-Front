import { ResetPasswordComponent } from './../reset-password/reset-password.component';
import { ViewUserComponent } from './../view-user/view-user.component';
import { DeleteUserComponent } from './../delete-user/delete-user.component';
import { UserManagementService } from './../../../../services/user-management.service';
import { UserModel } from './../../../../models/UserModel';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentModel } from 'src/app/models/DepartmentModel';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TranslateModule,MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,RouterLink,FormsModule,CommonModule,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent,TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, AfterViewInit {
  model: UserModel[] = [];
  page: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;
  search: string = '';
  selectedUserId: number | null = null;
  lang: any = localStorage.getItem('lang');
  departments: DepartmentModel[] = [];
  
  displayedColumns: string[] = ['username', 'fullname', 'role', 'email', 'department', 'action'];
  dataSource = new MatTableDataSource<UserModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _service: UserManagementService,
    public dialog: MatDialog,
    private departmentService: DepartmentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadItems(this.page);
    this.dataSource.paginator = this.paginator;
    this.loadDepartments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadDepartments() {
    this.departmentService.GetDepartments().subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          this.departments = response.items as DepartmentModel[];
          this.updateUserDepartmentNames();
        } else {
          console.error('Invalid response format for departments:', response);
        }
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  updateUserDepartmentNames() {
    this.model.forEach(user => {
      const department = this.departments.find(dept => dept.id === Number(user.departmentId));
      if (department) {
        user['departmentName'] = department.name;
      }
    });
  }

  loadItems(pageNumber: number) {
    this._service.GetUserList(pageNumber, this.search).subscribe((res: any) => {
      this.model = res.items as UserModel[];
      this.applyStoredUserStatus();
      this.model.forEach(user => {
        user['isBlocked'] = user['isActive'] === false; 
      });
      this.dataSource.data = this.model;
      this.totalCount = res.totalCount;
      this.dataSource.paginator = this.paginator;
    });
  }
  
  applyStoredUserStatus(): void {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    this.model.forEach(user => {
      if (storedUsers.hasOwnProperty(user.id)) {
        user['isBlocked'] = storedUsers[user.id];
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadItems(this.page);
  }

  openEditDialog(userId: string) {
    const dialogRef = this.dialog.open(RegisterUserComponent, {
      width: '700px',
      data: { id: userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadItems(this.page);
        this.loadDepartments();
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(RegisterUserComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadItems(this.page);
        this.loadDepartments();
      }
    });
  }

  delete(id: string, username: string): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '400px',
      data: { id: id, username: username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadItems(this.page);
        this.loadDepartments();
      }
    });
  }

  resetPassword(user: UserModel): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '400px',
      data: { userId: user.id, fullName: user.fullname }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadItems(this.page);
        this.loadDepartments();
      }
    });
  }

  openViewDialog(user: UserModel): void {
    const dialogRef = this.dialog.open(ViewUserComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('View dialog closed:', result);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  blockUser(userId: number): void {
    this._service.blockUser(userId).subscribe(
      () => {
        this.updateUserStatus(userId, true);
        this.saveUserStatusToLocalStorage(userId, true);
      },
      error => {
        console.error('Error blocking user:', error);
      }
    );
  }

  unblockUser(userId: number): void {
    this._service.unblockUser(userId).subscribe(
      () => {
        this.updateUserStatus(userId, false);
        this.saveUserStatusToLocalStorage(userId, false);
      },
      error => {
        console.error('Error unblocking user:', error);
      }
    );
  }

  updateUserStatus(userId: number, isBlocked: boolean): void {
    const user = this.model.find(u => u.id === userId);
    if (user) {
      user['isBlocked'] = isBlocked;
      this.dataSource.data = [...this.model];
    }
  }

  saveUserStatusToLocalStorage(userId: number, isBlocked: boolean): void {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    storedUsers[userId] = isBlocked;
    localStorage.setItem('users', JSON.stringify(storedUsers));
  }
}
