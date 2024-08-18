import { RoleService } from './../../../../../services/role.service';
import { RoleModel } from './../../../../../models/RoleModel';
import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective, ToasterService } from '@coreui/angular';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [TranslateModule,MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,RouterLink,FormsModule,CommonModule,RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent,TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  displayedColumns: string[] = ['name','slug'];
  dataSource!: MatTableDataSource<RoleModel>;
  pageSize: number = environment.PageSize;
  totalCount: number = 0;
  page: number = 1;
  lang: any = localStorage.getItem('lang');
  search: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private _service: RoleService, public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData(): void {
    this._service.GetRoles().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<RoleModel>(res.items as RoleModel[]);
      this.totalCount = res.totalCount;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.loadData();
  }
}
