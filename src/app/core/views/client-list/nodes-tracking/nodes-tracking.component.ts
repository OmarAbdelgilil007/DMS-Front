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
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/app/environments/environment.development';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-nodes-tracking',
  standalone: true,
  imports: [TranslateModule,MatFormFieldModule,MatInputModule,MatSort,MatPaginator,MatTableModule,MatButtonModule,MatIconModule,MatMenuModule,TranslateModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './nodes-tracking.component.html',
  styleUrl: './nodes-tracking.component.scss'
})
export class NodesTrackingComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['time', 'user', 'state', 'comment'];
  pageSize: number = 10;
  totalCount: number = 0;
  value: any;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private _service: NodeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.value = params['id'];
      this.getNodeTrackingData();
    });
  }

  getNodeTrackingData(): void {
    if (this.value !== undefined) {
      this._service.GetNodeTrackingById(this.value).subscribe(
        (data: any) => {
          if (Array.isArray(data)) {
            this.dataSource = new MatTableDataSource(data);
            this.totalCount = data.length;
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          } else {
            console.error('Data is not an array:', data);
          }
        },
        error => {
          console.error('Error fetching node tracking data:', error);
        }
      );
    } else {
      console.error('Node ID is undefined');
    }
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
  }
}