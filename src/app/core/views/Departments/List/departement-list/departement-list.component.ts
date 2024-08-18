import { ViewComponent } from './../../../../shared/view/view.component';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from './../../../../../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { DepartmentModel } from 'src/app/models/DepartmentModel';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../../../shared/shared.module';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';
import { DepartmentAddComponent } from '../../Add/department-add/department-add.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-departement-list',
  standalone: true,
  imports: [TranslateModule,MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,SharedModule, RouterLink, FormsModule, CommonModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective],
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.css']  
})
export class DepartementListComponent {

  displayedColumns: string[] = ['name', "ParentName",'actions'];
  dataSource: MatTableDataSource<DepartmentModel>;
  pageSize: number = environment.PageSize;
  totalCount: number = 0;
  page: number = 1;
  model: DepartmentModel[] = [];
  lang: any = localStorage.getItem('lang');
  departments: DepartmentModel[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private _service: DepartmentService, public dialog: MatDialog, private toastr: ToastrService,private translate: TranslateService) {
    this.dataSource = new MatTableDataSource<DepartmentModel>([]);
    this.loadDepartments();
  }

  ngOnInit(): void {
    this.loadItems(this.page);
  }

  loadItems(pageNumber: number) {
    this._service.GetDepartments().subscribe((res: any) => {
      this.model = res.items as DepartmentModel[];
      this.totalCount = res.totalCount;
      this.dataSource.data = this.model.map(department => ({
        ...department,
        departmentName: this.getDepartmentName(department.parentId) // Add departmentName property
      }));

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  loadDepartments() {
    this._service.GetDepartments().subscribe(
      (response: any) => {
        if (response && response.items && Array.isArray(response.items)) {
          this.departments = response.items as DepartmentModel[];
          this.loadItems(this.page)
        } else {
          console.error('Invalid response format for departments:', response);
        }
      },
      (error) => {
        console.error('Error loading departments:', error);
      }
    );
  }

  getDepartmentName(parentId: number | null): string {
    const department = this.departments.find(dep => dep.id === parentId);
    return department ? department.name : '';
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.loadItems(this.page);
    this.loadDepartments();
  }

  loadData(): void {
    this._service.GetDepartments().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.items as DepartmentModel[]);
      this.dataSource.paginator = this.paginator;
    });
  }

  delete(id: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: { id: id, name: name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.delete(+id).subscribe(
          () => {
            this.toastr.success(this.translate.instant('Department.success.deleted'), this.translate.instant('success'), {
              closeButton: true
            });
            this.loadData();
            this.loadDepartments();
          },
          (error: any) => {
            this.toastr.error(this.translate.instant('Department.error.failedToDelete'), this.translate.instant('error'), {
              closeButton: true
            });
          }
        );
      }
    });
  }

  openAddDialog(defaultName: string = ''): void {
    const dialogRef = this.dialog.open(DepartmentAddComponent, {
      width: '400px',
      data: { name: defaultName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.AddDepartments(result).subscribe(
          () => {
            this.toastr.success(this.translate.instant('Department.success.added'), this.translate.instant('success'), {
              closeButton: true
            });
            this.loadData();
            this.loadDepartments();
          },
          (error) => {
            if (error.status === 500) {
              var errorMessage = error.error.message;
              if(errorMessage=="DuplicatedItem")
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
    });
  }
  

  openEditDialog(departmentData: DepartmentModel): void {
    const dialogRef = this.dialog.open(DepartmentAddComponent, {
      width: '400px',
      data: departmentData
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._service.Update(result).subscribe(
          () => {
            this.toastr.success(this.translate.instant('Department.success.updated'), this.translate.instant('success'), {
              closeButton: true
            });
            this.loadData();
            this.loadDepartments();
          },
          (error) => {
            if (error.status === 500) {
              var errorMessage = error.error.message;
              if(errorMessage=="DuplicatedItem")
                errorMessage = "There is already a department with this name.";
              this.toastr.error(errorMessage,'Error', {
                closeButton: true
              });
            } else {
              this.toastr.error('An error occurred while updating the department.','Error', {
                closeButton: true
              });
            }
          }
        );
      }
    });
  }


  updateLocalDepartmentList(updatedDepartment: DepartmentModel): void {
    const index = this.dataSource.data.findIndex(dep => dep.id === updatedDepartment.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedDepartment;
    }
  }

  openViewDialog(departmentData: DepartmentModel): void {
    const dialogRef = this.dialog.open(ViewComponent, {
      width: '400px',
      data: departmentData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}