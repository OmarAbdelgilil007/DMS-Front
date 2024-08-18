import { LoginLogsService } from './../../../services/loginLogs.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/app/environments/environment.development';

@Component({
  selector: 'app-login-logs',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,TranslateModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './login-logs.component.html',
  styleUrl: './login-logs.component.scss'
})
export class LoginLogsComponent implements OnInit {
  displayedColumns: string[] = ['loginDate', 'fullName', 'roleName', 'email', 'ip'];
  dataSource = new MatTableDataSource<any>();
  pageSize: number = environment.PageSize;
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private _service: LoginLogsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.loadData();
  }

  loadData(): void {
    this._service.GetLoginLogs().subscribe((res: any) => {
      this.dataSource.data = res;
      this.totalCount = res.totalCount;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }
}
