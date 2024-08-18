import { AuditsService } from './../../../services/Audits.service';
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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audits-logs',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,TranslateModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './audits-logs.component.html',
  styleUrl: './audits-logs.component.scss'
})

export class AuditsLogsComponent implements OnInit {
  filteredModel: any[] = [];
  page: number = 1;
  totalCount: number = 0;
  pageSize: number = 10; // Set your desired page size here
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private _service: AuditsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadData();
  }

  replaceAndSanitize(values: string): any {
    const replaced = values.replace(/,/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.loadData();
  }

  loadData(): void {
    this._service.GetLoginLogs().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res); 
      this.totalCount = res.totalCount;
      this.dataSource.paginator = this.paginator;
    });
  }
}