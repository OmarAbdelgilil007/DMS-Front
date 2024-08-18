import { ConfirmNameComponent } from './confirm-name/confirm-name.component';
import { ViewNodeComponent } from './view-node/view-node.component';
import { ConfrimDeleteNodeComponent } from './confrim-delete-node/confrim-delete-node.component';
import { ClientNodeComponent } from './client-node/client-node.component';
import { ClientService } from './../../../services/client.service';
import { Iclient } from './../../../models/Iclient';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  TableColorDirective,
  TableActiveDirective,
  BorderDirective,
  AlignDirective,
} from '@coreui/angular';
import { environment } from 'src/app/environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    TableColorDirective,
    TableActiveDirective,
    BorderDirective,
    AlignDirective,
    MatFormFieldModule,
    MatInputModule,
    MatSort,
    MatPaginator,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  lang: any = localStorage.getItem('lang');
  model: Iclient[] = [];
  dataSource: MatTableDataSource<Iclient>;
  filteredModel: Iclient[] = [];
  page: number = 1;
  totalCount: number = 0;
  pageSize: number = environment.PageSize;
  search: string = '';
  toggleAddClient: boolean = false;
  userRole = localStorage.getItem('userRole')

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(
    private _service: ClientService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<Iclient>([]);
  }
  ngOnInit(): void {
    if (localStorage.getItem('userRole') == 'Admin') {
      this.loadItemsForAdmin(this.page);
      this.toggleAddClient = true;
    } else {
      this.loadItemforRoles();
    }
  }

  loadItemsForAdmin(pageNumber: number) {
    this._service.GetNode().subscribe((res: any) => {
      this.dataSource.data = res as Iclient[];
      this.model = res as Iclient[];
      this.totalCount = res.totalCount;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  loadItemforRoles() {
    this._service.getClientByRole().subscribe((res: any) => {
      this.dataSource.data = res as Iclient[];
      this.model = res as Iclient[];
      this.totalCount = res.totalCount;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
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
    this.ngOnInit();
  }

  openClientNodeDialog(id?: number) {
    const dialogRef = this.dialog.open(ClientNodeComponent, {
      width: '500px',
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  openEditDialog(id: number): void {
    const dialogRef = this.dialog.open(ClientNodeComponent, {
      width: '500px',
      data: { id: id, Text: 'Client' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
  delete(id: number, name: string): void {
    const nameConfirmationDialogRef = this.dialog.open(ConfirmNameComponent, {
      width: '400px',
      data: { name: name },
    });

    nameConfirmationDialogRef.afterClosed().subscribe((isNameConfirmed) => {
      if (isNameConfirmed) {
        const deleteDialogRef = this.dialog.open(ConfrimDeleteNodeComponent, {
          width: '400px',
          data: { id: id, name: name },
        });

        deleteDialogRef.afterClosed().subscribe((isDeleted) => {
          if (isDeleted) {
            this._service.delete(+id).subscribe(
              () => {
                this.toastr.success(this.translate.instant('toastrMessages.success'), this.translate.instant('success'), {
                  closeButton: true
                });
                this.ngOnInit();
              },
              (error: any) => {
                this.toastr.success(this.translate.instant('toastrMessages.error'), this.translate.instant('error'), {
                  closeButton: true
                });
              }
            );
          }
        });
      }
    });
  }

  openViewDialog(clientData: Iclient): void {
    const dialogRef = this.dialog.open(ViewNodeComponent, {
      width: '800px',
      data: clientData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
}
